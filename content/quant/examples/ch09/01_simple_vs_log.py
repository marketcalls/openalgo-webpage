# Two ways to measure a return - and why quants quietly prefer logs.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
p = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date=start, end_date=end)["close"]

simple = p.pct_change().dropna()
logret = np.log(p / p.shift(1)).dropna()

print("Last 5 simple returns:", [round(x, 5) for x in simple.tail(5)])
print("Last 5 log returns   :", [round(x, 5) for x in logret.tail(5)])
print("(almost identical for small daily moves)\n")

# The magic of logs: they ADD across time.
print(f"Sum of daily log returns : {logret.sum():.5f}")
print(f"Log of the whole move    : {np.log(p.iloc[-1] / p.iloc[0]):.5f}   <- matches exactly")
print(f"Sum of simple returns    : {simple.sum():.5f}")
print(f"Actual compounded return : {(1 + simple).prod() - 1:.5f}   <- simple returns do NOT add")
