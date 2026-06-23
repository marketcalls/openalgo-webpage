# Simple daily returns: how much each day's close moved vs the day before, in one line.
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
df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)

prices = df["close"].to_numpy()
# (today - yesterday) / yesterday, computed for the whole array at once -- no loop.
returns = (prices[1:] - prices[:-1]) / prices[:-1]

print("Closes :", prices.size, " Returns:", returns.size, "(one fewer)")
print("Last 5 daily returns (%):", np.round(returns[-5:] * 100, 2))
print("Average daily return (%):", round(returns.mean() * 100, 3))
print("Best day (%):", round(returns.max() * 100, 2), " Worst day (%):", round(returns.min() * 100, 2))
