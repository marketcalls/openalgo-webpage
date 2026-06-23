# Volume Rate of Change (VROC): how fast volume itself is changing.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# VROC is a percentage: how much volume changed vs N bars ago.
df["VROC"] = ta.vroc(df["volume"], period=12)

vroc = df["VROC"].iloc[-1]
print(df[["close", "volume", "VROC"]].tail(5).round(2))
print(f"\nLatest VROC(12): {vroc:+.1f}%")
print("Participation is", "surging" if vroc > 50 else "drying up" if vroc < -50 else "steady")
print("A volume surge alongside a breakout adds conviction; a drop warns of a fake move.")
