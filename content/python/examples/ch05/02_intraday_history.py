# Intraday candles: same call, just a smaller interval like 5m.
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
print("5-minute candles:", len(df))
print("First:\n", df.head(2))
print("Last:\n", df.tail(2))
