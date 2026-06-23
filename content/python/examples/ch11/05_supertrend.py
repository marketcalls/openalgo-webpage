# Supertrend: a single line that flips above/below price and shouts "trend changed".
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

# Returns a TUPLE: the line itself, and a direction (-1 = uptrend, 1 = downtrend).
df["ST"], df["DIR"] = ta.supertrend(df["high"], df["low"], df["close"], period=10, multiplier=3.0)

last_dir = df["DIR"].iloc[-1]
print("HDFCBANK close:", round(df["close"].iloc[-1], 2))
print("Supertrend line:", round(df["ST"].iloc[-1], 2))
print("Direction:", "UPTREND (line below price)" if last_dir == -1 else "DOWNTREND (line above price)")

# A flip is where the direction value changes from one bar to the next.
flips = (df["DIR"].diff() != 0).sum() - 1
print("Trend flips in window:", int(flips))
