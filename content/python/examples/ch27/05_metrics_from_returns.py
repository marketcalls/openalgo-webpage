# The same metrics computed by hand from a daily-returns series - no magic.
import datetime
import os

import numpy as np
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="INFY", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))
pf = vbt.Portfolio.from_signals(close, entries, exits,
                                init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")

rets = pf.returns()                       # daily strategy returns
# Sharpe = mean / std of daily returns, scaled to a year (252 trading days).
sharpe = rets.mean() / rets.std() * np.sqrt(252)
# CAGR from compounding the daily returns.
total_growth = (1 + rets).prod()
cagr = total_growth ** (252 / len(rets)) - 1
print(f"Hand Sharpe : {sharpe:.2f}   vs VectorBT {pf.sharpe_ratio():.2f}")
print(f"Hand CAGR   : {cagr * 100:.2f}%  vs VectorBT {pf.annualized_return() * 100:.2f}%")
print("Same ballpark - small gaps come from library conventions (how open trades")
print("and the exact day-count are handled). The point: there is no magic here.")
