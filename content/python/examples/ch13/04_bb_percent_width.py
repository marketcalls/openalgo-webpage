# %B (where price sits in the bands) and Bandwidth (how wide the bands are = a squeeze gauge).
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

df["PCTB"] = ta.bbpercent(df["close"])
df["WIDTH"] = ta.bbwidth(df["close"])

pctb = df["PCTB"].iloc[-1]
width = df["WIDTH"].iloc[-1]
width_min = df["WIDTH"].tail(60).min()

print("HDFCBANK close:", round(df["close"].iloc[-1], 2))
print(f"%B       : {pctb:5.2f}   (1.0 = upper band, 0.0 = lower band)")
print(f"Bandwidth: {width:6.4f}  (60-day low was {width_min:.4f})")

# A bandwidth near its recent low is a "squeeze" -- coiled, often before a breakout.
print("Squeeze?", "YES -- bands tight, watch for a breakout" if width <= width_min * 1.1 else "no -- bands are not unusually tight")
