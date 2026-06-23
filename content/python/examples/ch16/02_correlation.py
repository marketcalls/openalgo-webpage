# Pearson Correlation: do two instruments move together?
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
a = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)
b = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# correlation runs from -1 (move opposite) through 0 (unrelated) to +1 (move together).
corr = ta.correlation(a["close"], b["close"], 20)
a["CORR"] = corr

c = a["CORR"].iloc[-1]
print(a[["close", "CORR"]].tail(5).round(3))
print(f"\nLatest 20-day correlation HDFCBANK vs ICICIBANK: {c:+.3f}")
print("Reading:", "strongly linked" if c > 0.7 else "loosely linked" if c > 0.3
      else "barely related" if c > -0.3 else "moving opposite")
print("Pairs traders want a HIGH, stable correlation between the two legs.")
