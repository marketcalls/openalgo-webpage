# WMA and HMA: two ways to fight "lag" -- the delay a moving average has behind price.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

df["WMA20"] = ta.wma(df["close"], 20)
df["HMA20"] = ta.hma(df["close"], 20)
df["SMA20"] = ta.sma(df["close"], 20)

price = df["close"].iloc[-1]
print("INFY close:", round(price, 2))
print(f"SMA20 = {df['SMA20'].iloc[-1]:8.2f}  (slowest, smoothest)")
print(f"WMA20 = {df['WMA20'].iloc[-1]:8.2f}  (recent-weighted)")
print(f"HMA20 = {df['HMA20'].iloc[-1]:8.2f}  (lowest lag, hugs price)")

# The HMA usually tracks price most closely -- less lag, but more noise.
gaps = {"SMA": abs(price - df["SMA20"].iloc[-1]),
        "WMA": abs(price - df["WMA20"].iloc[-1]),
        "HMA": abs(price - df["HMA20"].iloc[-1])}
print("Closest to price:", min(gaps, key=gaps.get))
