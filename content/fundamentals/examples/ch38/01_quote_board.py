import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

symbols = ["RELIANCE", "TCS", "INFY", "SBIN"]

# A live quote board - one row per symbol, aligned with the f-string tricks from Chapter 7.
print(f"{'Symbol':<12}{'LTP':>12}{'Prev close':>14}")
print("-" * 38)
for s in symbols:
    data = client.quotes(symbol=s, exchange="NSE")["data"]
    print(f"{s:<12}{data['ltp']:>12,.2f}{data['prev_close']:>14,.2f}")
