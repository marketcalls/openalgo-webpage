# MACD: two EMAs turned into a momentum signal. Three outputs in one tuple.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)

# Returns a TUPLE: macd line, signal line, histogram.
macd_line, signal_line, hist = ta.macd(df["close"])

m = macd_line.iloc[-1]
s = signal_line.iloc[-1]
h = hist.iloc[-1]

print("TCS close   :", round(df["close"].iloc[-1], 2))
print(f"MACD line   : {m:8.2f}")
print(f"Signal line : {s:8.2f}")
print(f"Histogram   : {h:8.2f}  (MACD minus signal)")
print("Momentum:", "BULLISH (MACD above signal)" if m > s else "BEARISH (MACD below signal)")
print("Push:", "strengthening" if h > 0 else "weakening / negative")
