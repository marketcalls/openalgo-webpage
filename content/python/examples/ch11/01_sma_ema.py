# The two starter moving averages: SMA (plain average) and EMA (recent-weighted).
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

df["SMA20"] = ta.sma(df["close"], 20)
df["EMA20"] = ta.ema(df["close"], 20)

price = df["close"].iloc[-1]
sma = df["SMA20"].iloc[-1]
ema = df["EMA20"].iloc[-1]

print(f"RELIANCE close : {price:8.2f}")
print(f"20-day SMA     : {sma:8.2f}")
print(f"20-day EMA     : {ema:8.2f}")
print("Trend read     :", "above average -> bullish" if price > sma else "below average -> bearish")
print("EMA reacts faster, so it sits closer to price:", round(abs(price - ema), 2), "vs SMA", round(abs(price - sma), 2))
