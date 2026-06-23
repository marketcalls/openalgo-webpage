# Download historical daily candles into a pandas DataFrame.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=15)).strftime("%Y-%m-%d")

df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)
print(df.tail())          # last few OHLCV rows
print("Rows downloaded:", len(df))
