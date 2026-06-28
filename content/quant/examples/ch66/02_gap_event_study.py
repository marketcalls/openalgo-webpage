# Toy event study: detect large overnight-gap days (a proxy for news shocks) and plot the average price path around them.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SYM, EXCH, GAP, W = "SBIN", "NSE", 0.02, 10
end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol=SYM, exchange=EXCH, interval="D",
                    start_date="2021-01-01", end_date=end).reset_index()
close = df["close"].values
gap = df["open"].values / np.roll(close, 1) - 1  # overnight gap vs prior close

# Event days: a large gap of either sign is our stand-in for an unscheduled news shock.
events = [i for i in range(W + 1, len(df) - W) if abs(gap[i]) > GAP]

# Build each window as cumulative return vs the close the day BEFORE the gap,
# then orient it in the direction of the gap so shocks add rather than cancel.
paths = []
for i in events:
    base = close[i - 1]
    path = (close[i - W: i + W + 1] / base - 1) * np.sign(gap[i]) * 100
    paths.append(path)
paths = np.array(paths)
offsets = np.arange(-W, W + 1)
mean_path = paths.mean(axis=0)
se = paths.std(axis=0) / np.sqrt(len(paths))

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.axvline(0, color="#888", ls="--", lw=1)
ax.fill_between(offsets, mean_path - se, mean_path + se, color="#7c83ff", alpha=0.2)
ax.plot(offsets, mean_path, color="#7c83ff", lw=1.8, marker="o", ms=3)
ax.set_title(f"{SYM}: average gap-oriented path around {len(events)} large-gap days (|gap| > {GAP:.0%})")
ax.set_xlabel("trading days from the gap (day 0)")
ax.set_ylabel("oriented return vs day -1 (%)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
jump = mean_path[W] - mean_path[W - 1]      # day -1 close to day 0 close (the shock)
drift = mean_path[-1] - mean_path[W]        # day 0 close to day +10 close (after)
print(f"{SYM}: {len(events)} large-gap days. Mean shock day 0 = {jump:+.2f}%, "
      f"then drift to day +{W} = {drift:+.2f}%. Saved {out.name}")
