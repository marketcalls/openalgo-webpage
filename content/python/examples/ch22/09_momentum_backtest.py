# Backtest a regime-filtered momentum trade on the strongest stock with VectorBT.
import os
from datetime import datetime, timedelta

import pandas as pd

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=500)).strftime("%Y-%m-%d")
# ICICIBANK led the 60-day momentum ranking earlier -- backtest a trend trade on it.
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
mom = close.pct_change(60)            # positive momentum = an uptrend
sma200 = ta.sma(close, 200)           # regime filter
bull = close > sma200

# Enter long only when BOTH momentum is positive AND we are in a bull regime.
entries = (mom > 0) & bull & ~((mom.shift(1) > 0) & bull.shift(1))
exits = (mom < 0) | ~bull

import vectorbt as vbt

pf = vbt.Portfolio.from_signals(close, entries.fillna(False), exits.fillna(False),
                                init_cash=200000, fees=0.001, freq="1D")
print("Momentum + 200-SMA regime filter on ICICIBANK")
print("Total return :", round(float(pf.total_return()) * 100, 2), "%")
print("Trades       :", int(pf.trades.count()))
print("Max drawdown :", round(float(pf.max_drawdown()) * 100, 2), "%")
print("\nThe regime filter is what stops momentum from buying into a crash.")
