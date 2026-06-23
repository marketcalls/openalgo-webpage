# Turn a column of closing prices into a NumPy array -- the basic unit of fast math.
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
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

prices = df["close"].to_numpy()        # one column -> a 1-D NumPy array
print("Type      :", type(prices).__name__)
print("Length    :", prices.size, "closes")
print("First/last :", round(prices[0], 2), "->", round(prices[-1], 2))
print("Average   :", round(prices.mean(), 2))
print("Highest   :", round(prices.max(), 2), " Lowest:", round(prices.min(), 2))
