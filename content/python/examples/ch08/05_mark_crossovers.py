# Mark where a fast average crosses a slow one: the signal on the chart.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)
x = list(range(len(df)))

df["fast"] = ta.ema(df["close"], 10)
df["slow"] = ta.ema(df["close"], 30)
df["buy"] = ta.crossover(df["fast"], df["slow"])
df["sell"] = ta.crossunder(df["fast"], df["slow"])
buy_pos = [i for i, b in enumerate(df["buy"]) if b]      # positions, not dates
sell_pos = [i for i, s in enumerate(df["sell"]) if s]

fig, ax = plt.subplots(figsize=(9, 4.5))
ax.plot(x, df["close"], color="#8b949e", linewidth=1, label="Close")
ax.plot(x, df["fast"], color="#1f6feb", linewidth=1.2, label="EMA 10")
ax.plot(x, df["slow"], color="#d29922", linewidth=1.2, label="EMA 30")
ax.scatter(buy_pos, df["close"].iloc[buy_pos], marker="^", color="#2ea043", s=90, label="Buy", zorder=5)
ax.scatter(sell_pos, df["close"].iloc[sell_pos], marker="v", color="#cf222e", s=90, label="Sell", zorder=5)
ax.set_title("ICICIBANK EMA crossover signals")
ax.legend()
ax.grid(True, alpha=0.3)

step = max(1, len(df) // 8)
ax.set_xticks(x[::step])
ax.set_xticklabels(df.index[::step].strftime("%d %b"), rotation=45, ha="right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name, "with", len(buy_pos), "buys and", len(sell_pos), "sells")
