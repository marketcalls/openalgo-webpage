# Cross-sectional momentum: each month, go long the winners and short the losers.
import os
from datetime import datetime

import numpy as np
import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
universe = ["RELIANCE", "INFY", "HDFCBANK", "ITC", "TATASTEEL", "ADANIENT", "SBIN",
            "BHARTIARTL", "MARUTI", "SUNPHARMA", "TITAN", "HINDALCO", "AXISBANK",
            "LT", "WIPRO", "POWERGRID"]

prices = pd.DataFrame({s: client.history(symbol=s, exchange="NSE", interval="D",
                                         start_date="2021-01-01", end_date=end)["close"]
                       for s in universe})

monthly = prices.resample("ME").last()
momentum = monthly.pct_change(6)            # 6-month return = the ranking signal
forward = monthly.pct_change().shift(-1)    # next month's return = the test

ls = []
for date in momentum.index:
    score = momentum.loc[date].dropna()
    if len(score) < 6:
        continue
    n = len(score) // 3
    winners, losers = score.nlargest(n).index, score.nsmallest(n).index
    ls.append(forward.loc[date, winners].mean() - forward.loc[date, losers].mean())

ls = pd.Series(ls).dropna()
print(f"Cross-sectional momentum (long winners, short losers), monthly rebalance:")
print(f"  Avg monthly long-short return : {ls.mean() * 100:+.2f}%")
print(f"  Win rate (positive months)    : {(ls > 0).mean() * 100:.0f}%")
print(f"  Annualised Sharpe             : {ls.mean() / ls.std() * np.sqrt(12):+.2f}")
print("\nSign and strength depend on the regime - momentum and reversal trade places over time.")
