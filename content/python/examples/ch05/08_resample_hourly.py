# The same trick intraday: turn 5-minute candles into hourly ones.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d")
df = client.history(symbol="SBIN", exchange="NSE", interval="5m", start_date=start, end_date=end)

ohlc = {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}
hourly = df.resample("60min").agg(ohlc).dropna()

print("5m rows:", len(df), "-> hourly rows:", len(hourly))
print(hourly.tail(3))
