# Opening Range Breakout (ORB): the high and low of the first 15 minutes.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d")
df = client.history(symbol="SBIN", exchange="NSE", interval="5m", start_date=start, end_date=end)

# The first 15 minutes = the 09:15, 09:20 and 09:25 bars. between_time selects them.
opening = df.between_time("09:15", "09:29")
ranges = opening.groupby(opening.index.date).agg(or_high=("high", "max"), or_low=("low", "min"))
ranges["width"] = ranges["or_high"] - ranges["or_low"]

print("Opening range (first 15 min) per session:")
print(ranges.tail(5).round(2))
print("\nA breakout BUY triggers if a later bar closes ABOVE that day's or_high;")
print("a breakout SELL triggers if it closes BELOW that day's or_low.")
