# Running max with .cummax() gives you drawdown -- the pain of every dip.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%d")
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

df["peak"] = df["close"].cummax()                       # highest close seen so far
df["drawdown"] = (df["close"] / df["peak"] - 1) * 100   # % below that peak today

print(df[["close", "peak", "drawdown"]].tail(4).round(2))
print("\nDeepest drawdown:", round(df["drawdown"].min(), 2), "%")
print("On date         :", df["drawdown"].idxmin().date())
