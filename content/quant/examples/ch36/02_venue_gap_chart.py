# The fleeting NSE-minus-BSE price gap over time - the tiny edge a smart router captures.
import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SYMBOL = "RELIANCE"
start, end = "2026-01-01", "2026-06-27"
cn = client.history(symbol=SYMBOL, exchange="NSE", interval="D", start_date=start, end_date=end)["close"]
cb = client.history(symbol=SYMBOL, exchange="BSE", interval="D", start_date=start, end_date=end)["close"]

px = pd.concat([cn, cb], axis=1, keys=["NSE", "BSE"]).dropna()
gap = px["NSE"] - px["BSE"]                       # rupees
bps = 10000 * gap / ((px["NSE"] + px["BSE"]) / 2)  # basis points of mid

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9.5, 4.6))
ax.axhline(0, color="#334155", lw=1.0)
ax.bar(bps.index, bps.values, width=1.0,
       color=["#16a34a" if v >= 0 else "#dc2626" for v in bps.values])
ax.set_title(f"{SYMBOL}: NSE close minus BSE close - small, fleeting gaps a router exploits")
ax.set_ylabel("Cross-venue gap (bps of mid)")
ax.set_xlabel("Trading day")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{SYMBOL} {len(px)} days: mean |gap| {bps.abs().mean():.1f} bps, "
      f"max |gap| {bps.abs().max():.1f} bps, days NSE dearer {int((gap > 0).sum())} / "
      f"BSE dearer {int((gap < 0).sum())}. Saved {out.name}")
