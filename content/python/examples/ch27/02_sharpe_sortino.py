# Sharpe and Sortino: return per unit of RISK, not return alone.
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

# Sharpe divides return by ALL volatility. Sortino only counts DOWNSIDE
# volatility - it doesn't punish you for big up days, which traders prefer.
print(f"Sharpe ratio : {pf.sharpe_ratio():.2f}")
print(f"Sortino ratio: {pf.sortino_ratio():.2f}")
print("Rough guide: Sharpe above 1 is good, above 2 is excellent, "
      "below 0 means you lost money.")
