# Calendar effects: does the day of the week change Nifty's return and volatility?
import os
from datetime import datetime

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2019-01-01", end_date=end)
df["ret"] = df["close"].pct_change() * 100
df["weekday"] = df.index.day_name()

order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
g = df.groupby("weekday")["ret"].agg(["mean", "std", "count"]).reindex(order)

print(f"{'DAY':11s}{'AVG RET':>10s}{'VOLATILITY':>13s}{'DAYS':>7s}")
for day in order:
    print(f"{day:11s}{g.loc[day, 'mean']:>9.3f}%{g.loc[day, 'std']:>12.2f}%{int(g.loc[day, 'count']):>7d}")

print("\nWeekly option expiry has long fallen mid-week - watch which day carries the highest volatility.")
print("Persistent, calendar-driven patterns like these are the seed of event-driven strategies.")
