# .resample() rolls daily candles up to weekly -- here on an MCX commodity.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# Each weekly candle: first open, highest high, lowest low, last close, summed volume.
rules = {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}
weekly = df.resample("W").agg(rules).dropna()

print("Daily rows:", len(df), "-> weekly rows:", len(weekly))
print(weekly.tail(4))
