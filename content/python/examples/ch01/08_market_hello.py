# Put it together: a tiny "market dashboard" for a list of stocks.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

watchlist = ["RELIANCE", "TCS", "INFY", "HDFCBANK"]
print(f"{'SYMBOL':10s} {'LTP':>10s} {'CHANGE%':>9s}")
for sym in watchlist:
    q = client.quotes(symbol=sym, exchange="NSE")["data"]
    pct = (q["ltp"] - q["prev_close"]) / q["prev_close"] * 100
    print(f"{sym:10s} {q['ltp']:>10.2f} {pct:>8.2f}%")
