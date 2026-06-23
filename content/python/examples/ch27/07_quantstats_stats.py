# QuantStats gives the same metrics straight from a returns series, in one import.
import datetime
import os

import quantstats as qs
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))
pf = vbt.Portfolio.from_signals(close, entries, exits,
                                init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")

# qs.stats.* takes a pandas Series of returns and returns one number each.
rets = pf.returns()
print(f"Sharpe      : {qs.stats.sharpe(rets):.2f}")
print(f"Sortino     : {qs.stats.sortino(rets):.2f}")
print(f"Max drawdown: {qs.stats.max_drawdown(rets) * 100:.2f}%")
print(f"CAGR        : {qs.stats.cagr(rets) * 100:.2f}%")
print(f"Volatility  : {qs.stats.volatility(rets) * 100:.2f}% (annualised)")
