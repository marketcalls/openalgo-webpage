# Correlation: do two stocks' daily returns tend to move together? (-1 to +1)
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


def daily_returns(symbol):
    df = client.history(symbol=symbol, exchange="NSE", interval="D", start_date=start, end_date=end)
    p = df["close"].to_numpy()
    return (p[1:] - p[:-1]) / p[:-1]


a, b = daily_returns("HDFCBANK"), daily_returns("ICICIBANK")
n = min(a.size, b.size)                      # line them up to equal length
corr = np.corrcoef(a[-n:], b[-n:])[0, 1]     # corrcoef returns a 2x2 matrix; take the off-diagonal
print("Days compared       :", n)
print("Correlation HDFCBANK vs ICICIBANK:", round(corr, 3))
print("Reads as:", "move together" if corr > 0.5 else "weak/independent link")
