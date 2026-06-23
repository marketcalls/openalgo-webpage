# Beta / hedge ratio: how many shares of leg B balance one share of leg A.
import os
import time
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")


def closes(symbol):
    for _ in range(3):
        df = client.history(symbol=symbol, exchange="NSE", interval="D",
                            start_date=start, end_date=end)
        if isinstance(df, pd.DataFrame) and "close" in df:
            return df["close"]
        time.sleep(1)
    raise RuntimeError(f"Could not fetch history for {symbol}: {df}")


a = closes("ICICIBANK")
b = closes("HDFCBANK")
pair = pd.DataFrame({"a": a, "b": b}).dropna()

# Hedge ratio (beta) = slope of a regression of A's price on B's price.
# polyfit(x, y, 1) returns [slope, intercept].
beta, intercept = np.polyfit(pair["b"], pair["a"], 1)
print(f"Hedge ratio (beta): {beta:.3f}")
print(f"Meaning: to be market-neutral, hold ~{beta:.2f} units of HDFCBANK for every 1 of ICICIBANK.")

# A beta-weighted spread is more stable than a raw price difference.
pair["spread"] = pair["a"] - beta * pair["b"]
print(f"\nBeta-neutral spread -- mean {pair['spread'].mean():.2f}, std {pair['spread'].std():.2f}")
print(pair[["spread"]].tail(4).round(2))
