# VWAP: the volume-weighted average price the day's traders actually paid.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# VWAP is an intraday tool, so we pull 5-minute candles for one symbol.
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d")
df = client.history(symbol="SBIN", exchange="NSE", interval="5m", start_date=start, end_date=end)

# VWAP needs high, low, close AND volume - price weighted by how much traded there.
df["VWAP"] = ta.vwap(df["high"], df["low"], df["close"], df["volume"])

last = df.iloc[-1]
print(df[["close", "volume", "VWAP"]].tail(5).round(2))
print(f"\nLast close: {last['close']:.2f}   VWAP: {last['VWAP']:.2f}")
print("Bias:", "above VWAP - buyers in control" if last["close"] > last["VWAP"]
      else "below VWAP - sellers in control")
