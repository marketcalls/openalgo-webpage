# The same backtest in 3 lines of VectorBT - now WITH realistic costs.
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

# fees=0.001 -> 0.1% per trade; slippage=0.0005 -> 0.05% of price lost on fills.
pf = vbt.Portfolio.from_signals(
    close, entries, exits,
    init_cash=100000, fees=0.001, slippage=0.0005, freq="1D",
)

print(f"Total return : {pf.total_return() * 100:.2f}%")
print(f"Final value  : {pf.final_value():,.0f}")
print(f"Total trades : {pf.trades.count()}")
print(f"Fees paid    : {pf.orders.fees.sum():,.0f}")
