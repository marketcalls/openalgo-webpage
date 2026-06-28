# Chart the two normalised prices and their spread z-score with entry bands.
import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

A, B = "HDFCBANK", "ICICIBANK"
start, end = "2026-06-16", "2026-06-27"
ca = client.history(symbol=A, exchange="NSE", interval="1m", start_date=start, end_date=end)["close"]
cb = client.history(symbol=B, exchange="NSE", interval="1m", start_date=start, end_date=end)["close"]

px = pd.concat([ca, cb], axis=1, keys=[A, B]).dropna().reset_index(drop=True)
norm = px / px.iloc[0] * 100.0          # both start at 100 so the co-movement is visible

beta = np.polyfit(px[B], px[A], 1)[0]
spread = px[A] - beta * px[B]
win = 60
z = (spread - spread.rolling(win).mean()) / spread.rolling(win).std()

sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6.5), sharex=True)

ax1.plot(norm[A], color="#7c83ff", lw=1.2, label=A)
ax1.plot(norm[B], color="#16a34a", lw=1.2, label=B)
ax1.set_title("Two bank names, normalised to 100 - they wander together")
ax1.set_ylabel("Normalised price")
ax1.legend(loc="upper left")

ax2.plot(z, color="#334155", lw=1.0)
for band, style in [(0, "-"), (1, ":"), (-1, ":"), (2, "--"), (-2, "--")]:
    ax2.axhline(band, color="#dc2626" if abs(band) == 2 else "#9a9a9a",
                ls=style, lw=1.0 if abs(band) == 2 else 0.8)
ax2.fill_between(z.index, 2, z, where=(z >= 2), color="#dc2626", alpha=0.25)
ax2.fill_between(z.index, -2, z, where=(z <= -2), color="#dc2626", alpha=0.25)
ax2.set_title("Spread z-score - red bands at +/-2 are the entry triggers")
ax2.set_ylabel("z-score")
ax2.set_xlabel("1-minute bars")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
n_hits = int((z.abs() >= 2).sum())
print(f"Plotted {len(px)} 1m bars; hedge ratio {beta:.3f}; {n_hits} bars beyond +/-2 sigma. Saved {out.name}")
