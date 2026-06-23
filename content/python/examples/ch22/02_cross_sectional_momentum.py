# Cross-sectional momentum: rank the universe by 60-day return, buy the leaders.
import os
import time
from datetime import datetime, timedelta

import pandas as pd

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")

universe = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "HINDUNILVR", "ITC"]


def closes(symbol):
    for _ in range(3):
        df = client.history(symbol=symbol, exchange="NSE", interval="D",
                            start_date=start, end_date=end)
        if isinstance(df, pd.DataFrame) and "close" in df:
            return df["close"]
        time.sleep(1)
    raise RuntimeError(f"Could not fetch history for {symbol}: {df}")


panel = pd.DataFrame({s: closes(s) for s in universe}).dropna()

# 60-day return for every stock, then sort high to low.
momentum = panel.pct_change(60).iloc[-1].sort_values(ascending=False) * 100

print("60-day return ranking (%):")
print(momentum.round(2).to_string())

top_n = 3
winners = list(momentum.head(top_n).index)
print(f"\nGo long the top {top_n}: {winners}")
print("'Cross-sectional' means we compare stocks AGAINST EACH OTHER, then hold the strongest.")
