# A trade signal is just a True/False question asked of every bar at once.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
ema20 = ta.ema(close, 20)

# "Is price above its 20-day EMA?" -- one boolean answer per bar.
above = close > ema20

print("Bars where price is above EMA20:", int(above.sum()), "of", len(above))
print("Most recent answer:", bool(above.iloc[-1]))
print(above.tail(5))
