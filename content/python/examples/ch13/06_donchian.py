# Donchian Channel: the highest high and lowest low of N bars -- a pure breakout map.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")

df = client.history(symbol="CRUDEOIL20JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# Donchian returns (upper, middle, lower).
up, mid, low = ta.donchian(df["high"], df["low"], period=20)

price = df["close"].iloc[-1]
print("CRUDEOIL close:", round(price, 1))
print(f"20-day high (upper): {up.iloc[-1]:.1f}")
print(f"20-day mid         : {mid.iloc[-1]:.1f}")
print(f"20-day low  (lower): {low.iloc[-1]:.1f}")

# Classic rule: a close at the upper channel is a breakout buy; at the lower, a breakdown.
if price >= up.iloc[-1]:
    print("Signal: new 20-day HIGH -> breakout (trend-follow long)")
elif price <= low.iloc[-1]:
    print("Signal: new 20-day LOW -> breakdown (trend-follow short)")
else:
    print("Signal: inside the channel -> no breakout yet")
