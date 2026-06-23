# if / elif / else turn market data into a decision.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

q = client.quotes(symbol="RELIANCE", exchange="NSE")["data"]
change = q["ltp"] - q["prev_close"]

if change > 0:
    print(f"RELIANCE is UP {change:.2f} today")
elif change < 0:
    print(f"RELIANCE is DOWN {abs(change):.2f} today")
else:
    print("RELIANCE is flat")
