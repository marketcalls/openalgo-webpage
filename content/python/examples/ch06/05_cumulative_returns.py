# Cumulative returns: compound the daily moves to see what 1 rupee grew into.
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

prices = df["close"].to_numpy()
returns = (prices[1:] - prices[:-1]) / prices[:-1]

# cumprod multiplies running totals: (1+r1)*(1+r2)*... = growth of 1 rupee.
growth = np.cumprod(1 + returns)
print("Sessions     :", returns.size)
print("1 rupee grew to:", round(growth[-1], 4))
print("Total return (%):", round((growth[-1] - 1) * 100, 2))
print("Peak value of 1 rupee along the way:", round(growth.max(), 4))
