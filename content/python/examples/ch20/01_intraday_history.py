# Pull 5-minute intraday candles -- the raw material for every intraday strategy.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d")

df = client.history(symbol="SBIN", exchange="NSE", interval="5m", start_date=start, end_date=end)

# Each row is one 5-minute candle. The index is a timezone-aware timestamp (IST).
print("5m candles:", len(df), "over", df.index.normalize().nunique(), "sessions")
print("First bar of the data:", df.index[0].strftime("%Y-%m-%d %H:%M"))
print("Last bar of the data: ", df.index[-1].strftime("%Y-%m-%d %H:%M"))
print(df[["open", "high", "low", "close", "volume"]].head(3))
