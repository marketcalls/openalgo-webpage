# Awesome Oscillator (AO): momentum as the gap between two midpoint averages.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# AO = SMA(5) of the bar midpoint minus SMA(34). Uses high & low only. Unbounded, oscillates around 0.
df["AO"] = ta.awesome_oscillator(df["high"], df["low"])

ao = df["AO"].iloc[-1]
prev = df["AO"].iloc[-2]
print(df[["close", "AO"]].tail(5).round(2))
print(f"\nLatest AO: {ao:+.2f}")
print("Side of zero:", "bullish (above)" if ao > 0 else "bearish (below)")
print("Histogram bar color:", "green (rising)" if ao > prev else "red (falling)")
