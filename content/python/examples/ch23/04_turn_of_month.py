# Turn-of-month effect: are the last + first few trading days unusually strong?
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
# Rank each trading day inside its own month: 1, 2, 3 ... from the start.
month_key = df.index.to_period("M")
df["dom_rank"] = df.groupby(month_key).cumcount() + 1          # day-of-month rank
df["from_end"] = df.groupby(month_key).cumcount(ascending=False)  # 0 = last day

# Turn-of-month window = last 2 days of a month OR first 3 days of the next.
tom = (df["from_end"] <= 1) | (df["dom_rank"] <= 3)

print("Turn-of-month days :", int(tom.sum()))
print("Other days         :", int((~tom).sum()))
print("Avg return on turn-of-month days (%):", round(df.loc[tom, "ret"].mean(), 3))
print("Avg return on all other days     (%):", round(df.loc[~tom, "ret"].mean(), 3))
