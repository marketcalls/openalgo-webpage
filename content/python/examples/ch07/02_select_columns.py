# Pull single columns (Series) and several columns (a smaller DataFrame).
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=40)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]                  # one column -> a Series
print("close is a", type(close).__name__)
print("Latest close :", close.iloc[-1])      # iloc[-1] = last value by position
print("Highest close:", close.max())
print("Average close:", round(close.mean(), 2))

hl = df[["high", "low"]]             # two columns -> a DataFrame
print("\nHigh/Low table (last 3 rows):")
print(hl.tail(3))
