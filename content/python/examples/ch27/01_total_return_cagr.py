# Total return vs CAGR: the same profit, told two different ways.
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

# Total return = the whole-period profit. CAGR = that profit re-expressed as a
# smooth yearly growth rate, so you can compare tests of different lengths.
print(f"Total return: {pf.total_return() * 100:.2f}%  (over the whole test)")
print(f"CAGR        : {pf.annualized_return() * 100:.2f}%  (per year, compounded)")
print("CAGR is the fairer yardstick: a 40% gain in 4 years is far worse than in 1.")
