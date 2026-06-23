# Aroon Up / Aroon Down: time since the last new high vs new low.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY30JUN26FUT", exchange="NFO", interval="D", start_date=start, end_date=end)

# aroon returns a TUPLE (up, down). Each runs 0..100. High Up = recent new high.
aroon_up, aroon_down = ta.aroon(df["high"], df["low"], period=14)
df["Aroon_Up"] = aroon_up
df["Aroon_Down"] = aroon_down

up, dn = df["Aroon_Up"].iloc[-1], df["Aroon_Down"].iloc[-1]
print(df[["close", "Aroon_Up", "Aroon_Down"]].tail(5).round(0))
print(f"\nAroon Up: {up:.0f}   Aroon Down: {dn:.0f}")
print("Signal:", "strong uptrend" if up > 70 and dn < 30
      else "strong downtrend" if dn > 70 and up < 30 else "no dominant trend")
