# Foundation: pull years of NIFTY daily candles and add a daily-return column.
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

# Daily return = today's close vs yesterday's close, as a percentage.
df["ret"] = df["close"].pct_change() * 100

print("Trading days loaded:", len(df))
print("Date range:", df.index.min().date(), "to", df.index.max().date())
print("\nLast 3 days with returns:")
print(df[["close", "ret"]].tail(3).round(2))
