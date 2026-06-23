# RSI: a 0-100 speedometer for momentum. Above 70 = overbought, below 30 = oversold.
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

df["RSI14"] = ta.rsi(df["close"], 14)
rsi = df["RSI14"].iloc[-1]

print("RELIANCE close:", round(df["close"].iloc[-1], 2))
print("RSI(14)       :", round(rsi, 2))

if rsi > 70:
    print("Zone: OVERBOUGHT -> momentum stretched up, watch for a pullback")
elif rsi < 30:
    print("Zone: OVERSOLD -> momentum stretched down, watch for a bounce")
else:
    print("Zone: NEUTRAL (30-70) -> no extreme; 50 is the bull/bear line")
