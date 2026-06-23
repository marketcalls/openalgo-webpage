# ATR: the average distance price travels in a bar -- the building block of risk sizing.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

df["ATR14"] = ta.atr(df["high"], df["low"], df["close"], 14)
price = df["close"].iloc[-1]
atr = df["ATR14"].iloc[-1]

print("RELIANCE close:", round(price, 2))
print("ATR(14)       :", round(atr, 2), "rupees of typical daily range")

# A common rule: stop-loss = 2 x ATR away from entry.
stop = price - 2 * atr
print("Example stop  :", round(stop, 2), "(entry minus 2 x ATR)")
print("Risk per share:", round(price - stop, 2))
