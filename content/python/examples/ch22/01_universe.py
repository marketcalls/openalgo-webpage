# Build a small universe of 8 NSE stocks and download their daily closes.
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
    # Retry -- fetching many symbols in a loop can hit a busy data server.
    for _ in range(3):
        df = client.history(symbol=symbol, exchange="NSE", interval="D",
                            start_date=start, end_date=end)
        if isinstance(df, pd.DataFrame) and "close" in df:
            return df["close"]
        time.sleep(1)
    raise RuntimeError(f"Could not fetch history for {symbol}: {df}")


# One tidy table: dates down the rows, stocks across the columns.
panel = pd.DataFrame({symbol: closes(symbol) for symbol in universe}).dropna()
print("Universe:", len(universe), "stocks,", len(panel), "common trading days")
print(panel.tail(3).round(1))
