# Implied leverage (notional / total margin) for index vs single-stock futures, all real.
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

# (symbol, lot size, kind) - real NFO lot sizes.
book = [
    ("NIFTY28JUL26FUT", 65, "index"),
    ("BANKNIFTY28JUL26FUT", 30, "index"),
    ("RELIANCE28JUL26FUT", 500, "stock"),
    ("SBIN28JUL26FUT", 750, "stock"),
]

labels, levs, kinds = [], [], []
for sym, lot, kind in book:
    ltp = client.quotes(symbol=sym, exchange="NFO")["data"]["ltp"]
    total = client.margin(positions=[{
        "symbol": sym, "exchange": "NFO", "action": "BUY",
        "product": "NRML", "pricetype": "MARKET", "quantity": str(lot), "price": "0",
    }])["data"]["total_margin_required"]
    labels.append(sym.replace("28JUL26FUT", ""))
    levs.append(ltp * lot / total)
    kinds.append(kind)

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(7.2, 4.3))
palette = ["#7c83ff" if k == "index" else "#16a34a" for k in kinds]
sns.barplot(x=labels, y=levs, hue=labels, legend=False, palette=palette, ax=ax)
for i, v in enumerate(levs):
    ax.text(i, v + 0.08, f"{v:.1f}x", ha="center", fontsize=10)
ax.set_title("Implied leverage = notional / total margin (NRML, 1 lot)")
ax.set_ylabel("Leverage (x)")
ax.set_ylim(0, max(levs) + 1.2)
plt.savefig(Path(__file__).with_suffix(".png"), dpi=110, bbox_inches="tight")

idx = [l for l, k in zip(levs, kinds) if k == "index"]
stk = [l for l, k in zip(levs, kinds) if k == "stock"]
print("Implied leverage (notional / total margin), one lot each:")
for lab, lv in zip(labels, levs):
    print(f"  {lab:12s} {lv:.2f}x")
print(f"\nIndex futures ~{sum(idx) / len(idx):.1f}x vs single-stock futures "
      f"~{sum(stk) / len(stk):.1f}x - higher stock volatility means higher SPAN, so less leverage.")
