# .pct_change() turns a price column into daily percentage returns.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

df["ret"] = df["close"].pct_change()        # today/yesterday - 1, as a fraction
df["ret_pct"] = (df["ret"] * 100).round(2)  # same thing as a readable percentage

print(df[["close", "ret_pct"]].tail(5))

up_days = (df["ret"] > 0).sum()             # boolean True counts as 1
print("\nUp days     :", int(up_days), "of", df["ret"].notna().sum())
print("Best day    :", round(df["ret"].max() * 100, 2), "%")
print("Worst day   :", round(df["ret"].min() * 100, 2), "%")
print("Average day :", round(df["ret"].mean() * 100, 3), "%")
