# Finding extremes: max/min give the value, argmax/argmin give WHERE it happened.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

prices = df["close"].to_numpy()
dates = df.index.to_numpy()

hi_pos = prices.argmax()       # index (position) of the highest close
lo_pos = prices.argmin()       # index of the lowest close

print("Highest close:", round(prices[hi_pos], 2), "on", str(dates[hi_pos])[:10])
print("Lowest  close:", round(prices[lo_pos], 2), "on", str(dates[lo_pos])[:10])
print("Range (high - low):", round(prices.max() - prices.min(), 2))
print("Latest close vs the period high (%):", round((prices[-1] / prices.max() - 1) * 100, 2))
