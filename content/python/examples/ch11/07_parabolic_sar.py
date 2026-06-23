# Parabolic SAR: dots that trail price and mark a trailing stop / trend side. NFO future.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=15)).strftime("%Y-%m-%d")

df = client.history(symbol="NIFTY30JUN26FUT", exchange="NFO", interval="5m", start_date=start, end_date=end)

# psar returns one series of dot levels.
df["PSAR"] = ta.psar(df["high"], df["low"], acceleration=0.02, maximum=0.2)

price = df["close"].iloc[-1]
sar = df["PSAR"].iloc[-1]
print("NIFTY future close:", round(price, 2))
print("Parabolic SAR     :", round(sar, 2))

# SAR below price = long side (stop trails underneath); above price = short side.
if price > sar:
    print("SAR below price -> bullish; trail your stop at", round(sar, 2))
else:
    print("SAR above price -> bearish; trail your stop at", round(sar, 2))
