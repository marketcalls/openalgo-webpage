# Where is price sitting inside today's range? A quick read on intraday strength.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

q = client.quotes(symbol="TCS", exchange="NSE")["data"]
day_range = q["high"] - q["low"]
position = (q["ltp"] - q["low"]) / day_range * 100 if day_range else 0

print(f"Low {q['low']}   LTP {q['ltp']}   High {q['high']}")
print(f"Trading at {position:.0f}% of today's range")
