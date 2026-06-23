# Day-of-week seasonality: which weekday has historically paid the most?
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D", start_date=start, end_date=end)

df["ret"] = df["close"].pct_change() * 100
df = df.dropna(subset=["ret"])
# index.dayofweek: Monday=0 ... Friday=4. Keep regular weekdays, group, average.
df = df[df.index.dayofweek < 5]
names = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri"}
by_day = df.groupby(df.index.dayofweek)["ret"].agg(["mean", "count"])
by_day.index = by_day.index.map(names)

print("Average NIFTY return by weekday (%):")
print(by_day.round(3))
print("\nBest weekday on average:", by_day["mean"].idxmax())
