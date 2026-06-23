# The golden cross: 50-day SMA crossing above the 200-day SMA. A classic trend filter.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# 200-day SMA needs a long history -- ~400 calendar days gives plenty of bars.
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
sma50 = ta.sma(close, 50)
sma200 = ta.sma(close, 200)

regime = "BULLISH (golden cross)" if sma50.iloc[-1] > sma200.iloc[-1] else "BEARISH (death cross)"
print("Latest close :", round(float(close.iloc[-1]), 2))
print("SMA50  :", round(float(sma50.iloc[-1]), 2))
print("SMA200 :", round(float(sma200.iloc[-1]), 2))
print("Current regime:", regime)
