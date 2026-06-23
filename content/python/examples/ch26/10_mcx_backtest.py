# The same workflow on an MCX commodity future - backtesting is asset-agnostic.
import datetime
import os

import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)

# Gold trends well, so use a slightly slower pair (20/50).
fast, slow = ta.ema(close, 20), ta.ema(close, 50)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))
pf = vbt.Portfolio.from_signals(close, entries, exits,
                                init_cash=200000, fees=0.0005, slippage=0.0005, freq="1D")

print(f"Bars              : {len(close)}")
print(f"GOLDM total return: {pf.total_return() * 100:.2f}%")
print(f"Buy & hold return : {(close.iloc[-1] / close.iloc[0] - 1) * 100:.2f}%")
print(f"Max drawdown      : {pf.max_drawdown() * 100:.2f}%")
print(f"Trades            : {pf.trades.count()}")
