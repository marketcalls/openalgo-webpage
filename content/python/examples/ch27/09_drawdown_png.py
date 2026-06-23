# Plot the drawdown curve - a picture of how deep and how long the pain lasted.
import datetime
import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))
pf = vbt.Portfolio.from_signals(close, entries, exits,
                                init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")

# Drawdown = how far below the running peak the equity sits, as a percentage.
equity = pf.value()
drawdown = (equity / equity.cummax() - 1) * 100
x = list(range(len(drawdown)))                        # positional x, no gaps
fig, ax = plt.subplots(figsize=(9, 4))
ax.fill_between(x, drawdown.values, 0, color="firebrick", alpha=0.4)
ax.set_title(f"RELIANCE strategy drawdown (max {drawdown.min():.1f}%)")
ax.set_ylabel("Drawdown %")
step = max(1, len(drawdown) // 8)
ax.set_xticks(x[::step])
ax.set_xticklabels(drawdown.index[::step].strftime("%b %y"), rotation=45, ha="right")
out = Path(__file__).with_suffix(".png")
fig.savefig(out, dpi=110, bbox_inches="tight")
print(f"Worst drawdown: {drawdown.min():.2f}%")
print(f"Saved {out.name}")
