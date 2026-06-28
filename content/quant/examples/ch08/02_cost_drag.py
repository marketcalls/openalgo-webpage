# Costs compound. How much does trading frequency quietly bleed from a year's returns?
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

price = client.quotes(symbol="RELIANCE", exchange="NSE")["data"]["ltp"]
buy_val = price * 100
turnover = 2 * buy_val

# Delivery-equity stack (zero brokerage): STT dominates, as a % of capital deployed.
exch = 0.0000307 * turnover               # NSE delivery transaction charge
sebi = 0.000001 * turnover                # Rs 10 / crore
gst = 0.18 * (exch + sebi)
total = 0.001 * turnover + exch + sebi + gst + 0.00015 * buy_val
cost_pct = total / buy_val * 100          # cost of one round trip, in % (~0.22%)

trades = np.arange(0, 261, 10)            # round trips per year
drag = trades * cost_pct                  # annual cost drag, in %

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.fill_between(trades, drag, color="#7c83ff", alpha=0.25)
ax.plot(trades, drag, color="#7c83ff", lw=2)
ax.axhline(15, color="#dc2626", ls="--", lw=1.4, label="a 'good' 15% gross edge")
ax.set_title(f"Annual cost drag at {cost_pct:.3f}% per round trip")
ax.set_xlabel("Round trips per year")
ax.set_ylabel("Cost drag (% of capital)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Cost per round trip: {cost_pct:.3f}%")
print(f"At 100 trips/year, costs eat {100 * cost_pct:.1f}% of capital. Saved {out.name}")
