# Put-call parity builds a 'synthetic future' from options - the Black-76 forward.
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

# The synthetic future = ATM strike + ATM call price - ATM put price (put-call parity).
sf = client.syntheticfuture(underlying="NIFTY", exchange="NSE_INDEX", expiry_date="30JUN26")
spot = sf["underlying_ltp"]
synthetic = sf["synthetic_future_price"]
fut = client.quotes(symbol="NIFTY30JUN26FUT", exchange="NFO")["data"]["ltp"]

# A zoomed bar chart: spot sits just below the future and synthetic (the cost of carry).
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(7, 4.2))
labels = ["Spot", "Synthetic\nfuture", "Actual\nfuture"]
vals = [spot, synthetic, fut]
sns.barplot(x=labels, y=vals, hue=labels, legend=False,
            palette=["#888", "#16a34a", "#7c83ff"], ax=ax)
ax.set_ylim(min(vals) - 25, max(vals) + 15)        # zoom in to see the small gaps
for i, v in enumerate(vals):
    ax.text(i, v + 1, f"{v:.0f}", ha="center", fontsize=10)
ax.set_title("Spot vs synthetic future vs actual future")
ax.set_ylabel("NIFTY level")
plt.savefig(Path(__file__).with_suffix(".png"), dpi=110, bbox_inches="tight")

print(f"Spot LTP          : {spot:.2f}")
print(f"ATM strike        : {sf['atm_strike']:.0f}")
print(f"Synthetic future  : {synthetic:.2f}   (= strike + ATM call - ATM put)")
print(f"Actual future     : {fut:.2f}")
print(f"Synthetic vs real : {synthetic - fut:+.2f} difference")
print("\nThe synthetic future, built purely from option prices, tracks the real future -")
print("and it is the FORWARD that Indian F&O Greeks are priced against (Black-76, next chapter).")
