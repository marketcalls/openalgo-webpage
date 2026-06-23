# VWAP -- the volume-weighted average price, the intraday fair-value line.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=8)).strftime("%Y-%m-%d")
df = client.history(symbol="INFY", exchange="NSE", interval="5m", start_date=start, end_date=end)

# anchor="Session" resets the VWAP at the start of each trading day -- exactly what
# an intraday trader wants. It is the running average price weighted by volume.
df["vwap"] = ta.vwap(df["high"], df["low"], df["close"], df["volume"], anchor="Session")
df["gap"] = (df["close"] - df["vwap"]) / df["vwap"] * 100

print(df[["close", "vwap", "gap"]].tail(6).round(3))
last = df.iloc[-1]
side = "ABOVE" if last["close"] > last["vwap"] else "BELOW"
print(f"\nPrice is {side} VWAP by {abs(last['gap']):.2f}% -- bulls control the day when price holds above VWAP.")
