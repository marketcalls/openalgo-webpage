# A return is only impressive next to a benchmark: beat NIFTY buy-and-hold?
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
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))
pf = vbt.Portfolio.from_signals(close, entries, exits,
                                init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")

# Benchmark: just hold the NIFTY index over the same window. Indices live on
# the NSE_INDEX exchange.
nifty = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date=str(start), end_date=str(end))
nifty_close = nifty["close"].astype(float)
nifty_return = (nifty_close.iloc[-1] / nifty_close.iloc[0] - 1) * 100

print(f"Strategy return : {pf.total_return() * 100:.2f}%")
print(f"NIFTY buy & hold: {nifty_return:.2f}%")
edge = pf.total_return() * 100 - nifty_return
print(f"Edge over index : {edge:+.2f}%  ({'beat' if edge > 0 else 'lagged'} the market)")
