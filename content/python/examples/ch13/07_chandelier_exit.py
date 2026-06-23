# Chandelier Exit: an ATR-based trailing stop that hangs from the recent high (or low).
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")

df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# Returns a TUPLE: long-trade exit (below price) and short-trade exit (above price).
long_exit, short_exit = ta.chandelier_exit(df["high"], df["low"], df["close"], period=22, multiplier=3.0)

price = df["close"].iloc[-1]
le = long_exit.iloc[-1]
se = short_exit.iloc[-1]
print("GOLDM close       :", round(price, 1))
print("Long-trade stop   :", round(le, 1), "(exit a long if price closes below this)")
print("Short-trade stop  :", round(se, 1), "(exit a short if price closes above this)")

# Use the stop that matches the current trend: a long's stop sits below price,
# a short's stop sits above it. Either way the cushion (distance to the stop) is positive.
if price > le:
    print("Trade side        : long  -- cushion", round(price - le, 1), "points before the stop triggers")
else:
    print("Trade side        : short -- cushion", round(se - price, 1), "points before the stop triggers")
