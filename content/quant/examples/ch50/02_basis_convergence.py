# The basis collapses to zero as expiry nears: NIFTY June future minus spot over its life.
import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# The June contract is expiring now, so we can watch its full convergence.
START, END = "2026-04-01", "2026-06-28"
spot = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                      start_date=START, end_date=END)["close"]
fut = client.history(symbol="NIFTY30JUN26FUT", exchange="NFO", interval="D",
                     start_date=START, end_date=END)["close"]

basis = (fut - spot).dropna()            # points of premium, day by day

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.4))
ax.plot(basis.index, basis.values, color="#7c83ff", lw=1.8, label="basis = future - spot")
ax.fill_between(basis.index, basis.values, 0, color="#7c83ff", alpha=0.12)
ax.axhline(0, color="#dc2626", lw=1.1, ls="--", label="expiry: basis -> 0")
ax.set_title("NIFTY June future: the basis converges toward expiry")
ax.set_ylabel("Basis (points)")
ax.legend(loc="upper right")
fig.autofmt_xdate()
plt.savefig(Path(__file__).with_suffix(".png"), dpi=110, bbox_inches="tight")

print(
    f"SUMMARY: NIFTY June basis fell from {basis.iloc[0]:+.0f} pts on "
    f"{basis.index[0].date()} to {basis.iloc[-1]:+.0f} pts by "
    f"{basis.index[-1].date()} as expiry approached."
)
