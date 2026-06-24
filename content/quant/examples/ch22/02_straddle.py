# A long straddle buys volatility: it profits from a BIG move either way.
import os
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

STRIKE = 24000
call = client.quotes(symbol=f"NIFTY30JUN26{STRIKE}CE", exchange="NFO")["data"]["ltp"]
put = client.quotes(symbol=f"NIFTY30JUN26{STRIKE}PE", exchange="NFO")["data"]["ltp"]
cost = call + put                                   # premium paid for the straddle

spots = np.arange(STRIKE - 1200, STRIKE + 1200, 10)
payoff = np.abs(spots - STRIKE) - cost              # long straddle P&L at expiry
lower, upper = STRIKE - cost, STRIKE + cost         # breakevens

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(spots, payoff, color="#7c83ff", lw=2)
ax.axhline(0, color="#555", lw=1)
ax.fill_between(spots, payoff, 0, where=payoff > 0, color="#16a34a", alpha=0.2)
ax.fill_between(spots, payoff, 0, where=payoff < 0, color="#dc2626", alpha=0.2)
ax.axvline(lower, color="#888", ls="--", lw=1)
ax.axvline(upper, color="#888", ls="--", lw=1)
ax.set_title(f"Long {STRIKE} straddle - cost {cost:.0f}, profits beyond {lower:.0f} / {upper:.0f}")
ax.set_xlabel("NIFTY at expiry")
ax.set_ylabel("Profit / loss")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Straddle cost {cost:.0f} (call {call} + put {put}). Breaks even at {lower:.0f} and {upper:.0f}. Saved {out.name}")
