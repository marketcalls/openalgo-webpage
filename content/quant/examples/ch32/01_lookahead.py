# Look-ahead bias: forgetting to lag the signal by one bar fakes a brilliant edge.
import os
from datetime import datetime

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
c = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2021-01-01", end_date=end)["close"]
r = c.pct_change()

sma = c.rolling(20).mean()
signal = np.sign(c - sma)        # +1 above the average, -1 below (uses today's close)


def sharpe(x):
    x = x.dropna()
    return x.mean() / x.std() * np.sqrt(252)


cheat = sharpe(signal * r)          # BUG: trade today's return with today's signal
honest = sharpe(signal.shift(1) * r)  # correct: decide on yesterday's close, trade today

print(f"With look-ahead (signal * today's return) : Sharpe {cheat:+.2f}   <- looks amazing")
print(f"Correctly lagged (signal.shift(1))        : Sharpe {honest:+.2f}   <- the truth")
print(f"\nThe entire 'edge' was a one-bar indexing error. Always lag your signal before the return.")
