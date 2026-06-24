# Price discovery: stack up demand and supply and see where they would meet.
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

SYMBOL, EXCHANGE = "CRUDEOIL20JUL26FUT", "MCX"
d = client.depth(symbol=SYMBOL, exchange=EXCHANGE)["data"]

bids = pd.DataFrame(d["bids"]).sort_values("price", ascending=False)
asks = pd.DataFrame(d["asks"]).sort_values("price", ascending=True)
bids["cum"] = bids["quantity"].cumsum()    # buyers willing to pay this price or more
asks["cum"] = asks["quantity"].cumsum()    # sellers willing to sell this price or less

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.step(bids["price"], bids["cum"], where="post", color="#16a34a", lw=2, label="Demand (cumulative buyers)")
ax.step(asks["price"], asks["cum"], where="post", color="#dc2626", lw=2, label="Supply (cumulative sellers)")
best_bid, best_ask = bids["price"].iloc[0], asks["price"].iloc[0]
ax.axvspan(best_bid, best_ask, color="#9ca3af", alpha=0.18, label=f"the spread ({best_ask - best_bid:.0f})")
ax.set_title(f"{SYMBOL} - demand, supply and the gap between them")
ax.set_xlabel("Price")
ax.set_ylabel("Cumulative quantity")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Demand sits at <= {best_bid:.0f}, supply at >= {best_ask:.0f} - the gap is the spread. Saved {out.name}")
