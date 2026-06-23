# The price ratio: the simplest "spread" between two stocks.
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

# Ratio = price of leg A divided by price of leg B. For a stable pair this ratio
# wanders around a fairly constant level and is the thing we actually trade.
pair["ratio"] = pair["ICICIBANK"] / pair["HDFCBANK"]

print("Price ratio ICICIBANK / HDFCBANK:")
print(pair[["ICICIBANK", "HDFCBANK", "ratio"]].tail(5).round(3))
print(f"\nRatio mean over the window: {pair['ratio'].mean():.3f}")
print(f"Ratio min / max:            {pair['ratio'].min():.3f} / {pair['ratio'].max():.3f}")
