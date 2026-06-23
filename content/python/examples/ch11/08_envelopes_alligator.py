# MA Envelopes (a band around an average) and the Alligator (three shifted averages).
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)

# ma_envelopes(data) -> (upper, middle, lower)
up, mid, low = ta.ma_envelopes(df["close"], period=20, percentage=2.5)
# alligator(data) -> (jaw, teeth, lips) -- slow, medium, fast
jaw, teeth, lips = ta.alligator(df["close"])

price = df["close"].iloc[-1]
print("SBIN close:", round(price, 2))
print(f"Envelope   : lower {low.iloc[-1]:.2f} | mid {mid.iloc[-1]:.2f} | upper {up.iloc[-1]:.2f}")
print("Position   :", "near upper band (stretched up)" if price > mid.iloc[-1] else "near lower band (stretched down)")
print(f"Alligator  : lips {lips.iloc[-1]:.2f} > teeth {teeth.iloc[-1]:.2f} > jaw {jaw.iloc[-1]:.2f}?")

# Lips above teeth above jaw = the "alligator is eating" = a trend is underway.
if lips.iloc[-1] > teeth.iloc[-1] > jaw.iloc[-1]:
    print("Alligator read: lines fanned up -> bullish trend feeding")
elif lips.iloc[-1] < teeth.iloc[-1] < jaw.iloc[-1]:
    print("Alligator read: lines fanned down -> bearish trend feeding")
else:
    print("Alligator read: lines tangled -> sleeping (range)")
