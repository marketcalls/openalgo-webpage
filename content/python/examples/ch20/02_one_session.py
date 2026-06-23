# Slice out a single trading session -- intraday logic always runs day by day.
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

# Group by the calendar date (drop the time part) and take the most recent day.
sessions = df.groupby(df.index.normalize())
last_date = list(sessions.groups)[-1]
day = sessions.get_group(last_date)

print("Session:", last_date.strftime("%Y-%m-%d"), "with", len(day), "five-minute bars")
print("Open (first bar):", day["open"].iloc[0])
print("High of day:     ", day["high"].max())
print("Low of day:      ", day["low"].min())
print("Close (last bar):", day["close"].iloc[-1])
