# Vectorisation: do math on a whole array at once -- faster and cleaner than a loop.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)

prices = df["close"].to_numpy()

# One operation touches every element -- "broadcasting" a scalar across the array.
in_dollars = prices / 83.0                 # rough INR -> USD on the whole array
gap_from_avg = prices - prices.mean()      # distance of each close from the mean

print("First 3 prices in USD :", np.round(in_dollars[:3], 2))
print("Furthest above average:", round(gap_from_avg.max(), 2))
print("Furthest below average:", round(gap_from_avg.min(), 2))
# np.where picks element-by-element: 1 where price beat the mean, else 0.
above = np.where(prices > prices.mean(), 1, 0)
print("Days closing above the average:", int(above.sum()), "of", prices.size)
