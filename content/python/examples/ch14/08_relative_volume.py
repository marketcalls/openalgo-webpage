# Relative Volume (RVOL): is today busier than a normal day?
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY30JUN26FUT", exchange="NFO", interval="D", start_date=start, end_date=end)

# RVOL = today's volume / average volume over the period. 1.0 = average, 2.0 = double.
df["RVOL"] = ta.rvol(df["volume"], period=20)

rvol = df["RVOL"].iloc[-1]
print(df[["close", "volume", "RVOL"]].tail(5).round(2))
print(f"\nLatest RVOL: {rvol:.2f}x the 20-day average")
print("Activity:", "unusually high - breakouts are more trustworthy" if rvol > 1.5
      else "quiet - moves may not stick" if rvol < 0.7 else "roughly normal")
