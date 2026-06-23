# Pair trading starts with two related stocks. We use ICICIBANK and HDFCBANK --
# two large private banks that tend to move together.
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


def closes(symbol):
    # Retry once -- a busy data server occasionally returns an error instead of a DataFrame.
    for _ in range(3):
        df = client.history(symbol=symbol, exchange="NSE", interval="D", start_date=start, end_date=end)
        if isinstance(df, pd.DataFrame) and "close" in df:
            return df["close"]
        time.sleep(1)
    raise RuntimeError(f"Could not fetch history for {symbol}: {df}")


# Line the two price series up on the same dates with a DataFrame.
pair = pd.DataFrame({"ICICIBANK": closes("ICICIBANK"), "HDFCBANK": closes("HDFCBANK")}).dropna()
print("Aligned daily closes:", len(pair), "rows")
print(pair.tail(5).round(2))
