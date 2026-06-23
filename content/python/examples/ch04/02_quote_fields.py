# Pick the fields you need and turn them into useful numbers.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

q = client.quotes(symbol="RELIANCE", exchange="NSE")["data"]
change = q["ltp"] - q["prev_close"]

print("LTP        :", q["ltp"])
print("Day range  :", q["low"], "to", q["high"])
print("Prev close :", q["prev_close"])
print("Volume     :", q["volume"])
print("Change     :", round(change, 2), f"({change / q['prev_close'] * 100:.2f}%)")
