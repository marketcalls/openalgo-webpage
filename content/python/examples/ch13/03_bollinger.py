# Bollinger Bands: a moving average with elastic bands set 2 std-devs out.
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

# Returns a TUPLE: upper, middle (SMA), lower.
upper, middle, lower = ta.bbands(df["close"], period=20, std_dev=2.0)

price = df["close"].iloc[-1]
print("TCS close   :", round(price, 2))
print(f"Upper band  : {upper.iloc[-1]:8.2f}")
print(f"Middle (SMA): {middle.iloc[-1]:8.2f}")
print(f"Lower band  : {lower.iloc[-1]:8.2f}")

if price >= upper.iloc[-1]:
    print("Read: riding the UPPER band -> strong up move or stretched")
elif price <= lower.iloc[-1]:
    print("Read: tagging the LOWER band -> weak or oversold")
else:
    print("Read: inside the bands -> normal range")
