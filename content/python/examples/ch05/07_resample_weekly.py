# Roll daily candles up into weekly ones with pandas resample().
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

ohlc = {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}
weekly = df.resample("W").agg(ohlc).dropna()

print("Daily rows:", len(df), "-> weekly rows:", len(weekly))
print(weekly.tail(3))
