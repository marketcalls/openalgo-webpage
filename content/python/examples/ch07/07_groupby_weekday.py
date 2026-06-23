# .groupby() answers "which weekday has the best average return?"
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)

df["ret"] = df["close"].pct_change()
df["weekday"] = df.index.day_name()        # Monday, Tuesday, ... from the timestamp

# Group the returns by weekday and average each group.
by_day = df.groupby("weekday")["ret"].mean() * 100
order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
by_day = by_day.reindex(order)             # keep the natural week order

print("Average daily return by weekday (%):")
print(by_day.round(3))
print("\nBest weekday on average:", by_day.idxmax())
