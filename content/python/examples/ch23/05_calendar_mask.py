# Boolean calendar masks: a True/False filter you can AND/OR like a trading rule.
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

# Each mask is a column of True/False, one per trading day.
is_monday = df.index.dayofweek == 0
is_friday = df.index.dayofweek == 4
is_q4 = df.index.month >= 10            # Oct, Nov, Dec

# Combine masks with & (and) / | (or) to express a precise calendar rule.
friday_in_q4 = is_friday & is_q4

print("Mondays in data :", int(is_monday.sum()), "| avg ret %:", round(df.loc[is_monday, "ret"].mean(), 3))
print("Fridays in data :", int(is_friday.sum()), "| avg ret %:", round(df.loc[is_friday, "ret"].mean(), 3))
print("Fridays in Q4   :", int(friday_in_q4.sum()), "| avg ret %:", round(df.loc[friday_in_q4, "ret"].mean(), 3))
