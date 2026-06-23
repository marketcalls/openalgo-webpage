# Slice rows by date with .loc -- the timestamp index makes this effortless.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now()
start = end - timedelta(days=90)
df = client.history(symbol="INFY", exchange="NSE", interval="D",
                    start_date=start.strftime("%Y-%m-%d"), end_date=end.strftime("%Y-%m-%d"))

# Last 30 calendar days as a date string -- .loc selects every row from there on.
last_month = (end - timedelta(days=30)).strftime("%Y-%m-%d")
recent = df.loc[last_month:]
print(f"Rows since {last_month}:", len(recent))
print("Close range in window:", recent["close"].min(), "to", recent["close"].max())

# .loc also reads a single row by its exact index label.
one_row = df.loc[df.index[-1]]
print("\nMost recent session:")
print(one_row)
