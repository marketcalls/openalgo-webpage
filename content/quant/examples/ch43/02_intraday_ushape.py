# The intraday volatility U-shape: average absolute 1m return by minute-of-day for RELIANCE.
import os
from datetime import datetime
from pathlib import Path

import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="1m",
                    start_date="2026-03-01", end_date=end)

px = df["close"]
# 1m log returns within each session (overnight gap dropped), in basis points
ret = (np.log(px).groupby(px.index.normalize()).diff().dropna().abs()) * 1e4
tod = ret.index.strftime("%H:%M")
profile = ret.groupby(tod).mean()                 # average |return| by minute-of-day
profile = profile.sort_index()

x = np.arange(len(profile))
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(x, profile.values, color="#7c83ff", lw=1.6)
ax.fill_between(x, profile.values, color="#7c83ff", alpha=0.12)
ticks = [t for t in ["09:15", "10:30", "12:00", "13:30", "15:00", "15:29"] if t in profile.index]
ax.set_xticks([profile.index.get_loc(t) for t in ticks])
ax.set_xticklabels(ticks)
ax.set_title("RELIANCE - average absolute 1m return by minute of day (the intraday U-shape)")
ax.set_ylabel("Mean |return| (basis points)")
ax.set_xlabel("Time of day (IST)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

open_v = profile.iloc[:15].mean()                 # first ~15 min
mid_v = profile.loc["12:00":"13:00"].mean()       # lunch lull
close_v = profile.iloc[-15:].mean()               # last ~15 min
print(f"RELIANCE intraday vol U-shape: open {open_v:.1f} bps, midday {mid_v:.1f} bps, close {close_v:.1f} bps "
      f"per minute -> open is {open_v / mid_v:.1f}x the midday lull. Saved {out.name}")
