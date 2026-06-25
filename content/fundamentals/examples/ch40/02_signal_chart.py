from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
close = df["Close"]

fast = close.rolling(10).mean()        # short moving average
slow = close.rolling(30).mean()        # long moving average

# Signal: in the market when the fast average is above the slow one.
position = (fast > slow).astype(int)
cross = position.diff()                # +1 = a fresh buy, -1 = a fresh sell
buys = close[cross == 1]
sells = close[cross == -1]

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.5))
ax.plot(close.index, close, color="#9aa0c4", lw=1.1, label="Close")
ax.plot(fast.index, fast, color="#7c83ff", lw=1.6, label="10-day SMA")
ax.plot(slow.index, slow, color="#e0a06a", lw=1.6, label="30-day SMA")
ax.scatter(buys.index, buys, marker="^", color="#21c87a", s=95, label="Buy", zorder=5)
ax.scatter(sells.index, sells, marker="v", color="#e05a5a", s=95, label="Sell", zorder=5)
ax.set_title("RELIANCE - 10/30 moving-average crossover")
ax.set_ylabel("Price (Rs)")
ax.legend(loc="upper right", fontsize=8)

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Buy signals : {(cross == 1).sum()}")
print(f"Sell signals: {(cross == -1).sum()}")
