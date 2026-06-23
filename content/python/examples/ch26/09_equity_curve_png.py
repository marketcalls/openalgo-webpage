# Save the strategy's equity curve next to buy-and-hold as a PNG.
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
df = client.history(symbol="SBIN", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))
pf = vbt.Portfolio.from_signals(close, entries, exits,
                                init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")

equity = pf.value()                                   # strategy account value
buyhold = 100000 * (close / close.iloc[0])            # buy-and-hold value
x = list(range(len(equity)))                          # positional x, no gaps
fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(x, equity.values, label="EMA crossover")
ax.plot(x, buyhold.values, label="Buy & hold", alpha=0.7)
ax.set_title("SBIN EMA 10/30 - equity curve"); ax.set_ylabel("Account value"); ax.legend()
step = max(1, len(equity) // 8)
ax.set_xticks(x[::step])
ax.set_xticklabels(equity.index[::step].strftime("%b %y"), rotation=45, ha="right")
out = Path(__file__).with_suffix(".png")
fig.savefig(out, dpi=110, bbox_inches="tight")
print(f"Saved {out.name}")
