# The smaller the interval, the more candles you get for the same window.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d")

for interval in ["D", "1h", "15m", "5m"]:
    df = client.history(symbol="TCS", exchange="NSE", interval=interval, start_date=start, end_date=end)
    print(f"{interval:4s}: {len(df):>4} candles")
