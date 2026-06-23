# Boolean masks: ask a True/False question of every element, then keep only the matches.
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
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

prices = df["close"].to_numpy()
returns = (prices[1:] - prices[:-1]) / prices[:-1]

big_move = np.abs(returns) > 0.02      # mask: True on days that moved more than 2%
print("Total days        :", returns.size)
print("Big-move days (>2%):", int(big_move.sum()))
print("Their returns (%) :", np.round(returns[big_move] * 100, 2))   # filter with the mask
up_days = returns > 0
print("Up days:", int(up_days.sum()), " Down days:", int((~up_days).sum()))
