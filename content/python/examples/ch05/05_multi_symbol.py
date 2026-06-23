# Download several symbols into a dictionary of DataFrames -- one per stock.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")

data = {}
for sym in ["RELIANCE", "TCS", "INFY"]:
    data[sym] = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)

for sym, df in data.items():
    print(f"{sym:10s} last close {df['close'].iloc[-1]:>10.2f}  ({len(df)} rows)")
