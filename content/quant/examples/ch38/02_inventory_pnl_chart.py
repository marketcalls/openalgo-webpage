# Plot inventory and cumulative P&L (spread vs total) for a market maker over one session.
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

np.random.seed(7)  # deterministic sim; seed kept for reproducibility

SYMBOL, DAY = "RELIANCE", "2026-06-25"
HALF, CLIP, SKEW = 0.20, 100, 0.01
df = client.history(symbol=SYMBOL, exchange="NSE", interval="1m", start_date=DAY, end_date=DAY)
h, l, c = df["high"].values, df["low"].values, df["close"].values

cash, inv, spread, mid = 0.0, 0, 0.0, c[0]
inv_path, spread_path, total_path = [], [], []
for i in range(len(c)):
    bid = mid - HALF - SKEW * (inv / CLIP)
    ask = mid + HALF - SKEW * (inv / CLIP)
    if l[i] <= bid:
        cash -= bid * CLIP; inv += CLIP; spread += (mid - bid) * CLIP
    if h[i] >= ask:
        cash += ask * CLIP; inv -= CLIP; spread += (ask - mid) * CLIP
    mid = c[i]
    inv_path.append(inv); spread_path.append(spread); total_path.append(cash + inv * c[i])

x = np.arange(len(c))
sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6.5), sharex=True)

ax1.axhline(0, color="#9a9a9a", lw=0.8)
ax1.fill_between(x, 0, inv_path, where=(np.array(inv_path) >= 0), color="#16a34a", alpha=0.35, label="long")
ax1.fill_between(x, 0, inv_path, where=(np.array(inv_path) < 0), color="#dc2626", alpha=0.35, label="short")
ax1.plot(x, inv_path, color="#334155", lw=0.9)
ax1.set_title(f"{SYMBOL} {DAY}: inventory the skew keeps near flat (shares held)")
ax1.set_ylabel("Inventory (shares)")
ax1.legend(loc="upper left")

ax2.plot(x, spread_path, color="#7c83ff", lw=1.4, label="spread captured (gross)")
ax2.plot(x, total_path, color="#dc2626", lw=1.4, label="net P&L (after inventory m2m)")
ax2.axhline(0, color="#9a9a9a", lw=0.8)
ax2.fill_between(x, spread_path, total_path, color="#dc2626", alpha=0.12)
ax2.set_title("Spread is steady income; the gap below it is inventory mark-to-market")
ax2.set_ylabel("Cumulative P&L (Rs)")
ax2.set_xlabel("1-minute bars")
ax2.legend(loc="lower left")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{len(c)} bars: spread Rs {spread_path[-1]:+,.0f}, net Rs {total_path[-1]:+,.0f}, "
      f"peak inventory {int(np.abs(inv_path).max()):,} shares. Saved {out.name}")
