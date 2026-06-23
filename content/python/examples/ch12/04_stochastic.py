# Stochastic: where does the close sit inside its recent range? Returns %K and %D.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# Returns a TUPLE: %K (fast) and %D (its smoothed average).
k, d = ta.stochastic(df["high"], df["low"], df["close"], k_period=14, d_period=3)

kv = k.iloc[-1]
dv = d.iloc[-1]
print("HDFCBANK close:", round(df["close"].iloc[-1], 2))
print(f"%K = {kv:6.2f}   %D = {dv:6.2f}")

if kv > 80:
    print("Zone: OVERBOUGHT (>80) -> close near top of its range")
elif kv < 20:
    print("Zone: OVERSOLD (<20) -> close near bottom of its range")
else:
    print("Zone: mid-range (20-80)")
print("Cross:", "%K above %D -> bullish tilt" if kv > dv else "%K below %D -> bearish tilt")
