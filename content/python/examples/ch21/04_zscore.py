# Z-score of the spread: how many standard deviations is the ratio from "normal"?
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
    for _ in range(3):
        df = client.history(symbol=symbol, exchange="NSE", interval="D",
                            start_date=start, end_date=end)
        if isinstance(df, pd.DataFrame) and "close" in df:
            return df["close"]
        time.sleep(1)
    raise RuntimeError(f"Could not fetch history for {symbol}: {df}")


pair = pd.DataFrame({"ICICIBANK": closes("ICICIBANK"), "HDFCBANK": closes("HDFCBANK")}).dropna()
pair["ratio"] = pair["ICICIBANK"] / pair["HDFCBANK"]

# Rolling mean and standard deviation over a 30-day window define "normal".
window = 30
pair["mean"] = pair["ratio"].rolling(window).mean()
pair["std"] = pair["ratio"].rolling(window).std()
# Z-score = (value - mean) / std. Zero means dead-on average; +2 means stretched high.
pair["zscore"] = (pair["ratio"] - pair["mean"]) / pair["std"]

print(pair[["ratio", "mean", "zscore"]].dropna().tail(6).round(3))
z = pair["zscore"].iloc[-1]
print(f"\nLatest z-score: {z:.2f}  -- the spread is {abs(z):.1f} std devs",
      "above" if z > 0 else "below", "its 30-day mean.")
