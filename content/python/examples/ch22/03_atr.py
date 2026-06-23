# ATR (Average True Range): a clean dollar measure of how much a stock moves per day.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

# ATR averages the true range (today's range, accounting for gaps) over 14 days.
df["atr"] = ta.atr(df["high"], df["low"], df["close"], period=14)
df["atr_pct"] = df["atr"] / df["close"] * 100

print(df[["close", "atr", "atr_pct"]].tail(5).round(2))
last = df.iloc[-1]
print(f"\nRELIANCE typically moves about Rs {last['atr']:.1f} a day ({last['atr_pct']:.2f}% of price).")
print("ATR is the building block for both breakout levels and position sizing.")
