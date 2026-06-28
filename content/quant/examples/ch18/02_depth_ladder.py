# Picture the order book: resting buy demand (green) vs sell supply (red) by price.
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

bids = pd.DataFrame(d["bids"]).assign(side="Bid (buyers)")
asks = pd.DataFrame(d["asks"]).assign(side="Ask (sellers)")
book = pd.concat([asks, bids]).sort_values("price", ascending=False)
book["level"] = book["price"].map(lambda p: f"{p:.1f}")

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.barplot(data=book, x="quantity", y="level", hue="side", dodge=False,
            order=book["level"], palette={"Bid (buyers)": "#16a34a", "Ask (sellers)": "#dc2626"}, ax=ax)
ax.set_title(f"{SYMBOL} - the order book as a ladder")
ax.set_xlabel("Quantity waiting at this price")
ax.set_ylabel("Price")
ax.legend(title="")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Best bid {d['bids'][0]['price']}  best ask {d['asks'][0]['price']}. Saved {out.name}")
