# Log returns: the version quants prefer because they add up cleanly across days.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

prices = df["close"].to_numpy()
simple = (prices[1:] - prices[:-1]) / prices[:-1]      # ordinary % change
log_ret = np.log(prices[1:] / prices[:-1])             # natural log of the price ratio

print("Last 5 simple returns (%):", np.round(simple[-5:] * 100, 2))
print("Last 5 log    returns (%):", np.round(log_ret[-5:] * 100, 2))
# Log returns add up; the sum equals the log of the whole-period move.
print("Sum of log returns      :", round(log_ret.sum(), 4))
print("Log of total move       :", round(np.log(prices[-1] / prices[0]), 4))
