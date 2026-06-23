# .rolling() slides a window across the data -- the basis of every moving average.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

df["sma20"] = df["close"].rolling(window=20).mean()   # 20-day simple moving average
df["sma50"] = df["close"].rolling(window=50).mean()   # 50-day simple moving average

print(df[["close", "sma20", "sma50"]].tail(4))

# A classic read: is price trading above its 20-day average?
last = df.iloc[-1]
trend = "above" if last["close"] > last["sma20"] else "below"
print(f"\nClose {last['close']} is {trend} the 20-day average {round(last['sma20'], 2)}")
