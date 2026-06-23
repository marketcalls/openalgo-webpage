# Same signals, two strategies: long-only (sit in cash) vs both (flip to short).
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
df = client.history(symbol="SBIN", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))

# Long-only: on an exit you go to CASH and wait for the next entry.
long_only = vbt.Portfolio.from_signals(close, entries, exits, direction="longonly",
                                       init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")
# Both: on an exit you don't just sell - you go SHORT until the next entry.
both = vbt.Portfolio.from_signals(close, entries, exits, direction="both",
                                  init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")

print(f"Long-only return: {long_only.total_return() * 100:6.2f}%  trades {long_only.trades.count()}")
print(f"Both-way return : {both.total_return() * 100:6.2f}%  trades {both.trades.count()}")
print("Going short adds trades and risk - only worth it if the asset trends down too.")
