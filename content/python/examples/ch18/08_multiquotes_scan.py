# For a live snapshot scan, one multiquotes() call beats a loop of single quotes.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Mix exchanges freely -- NSE equity plus an NFO future in one request.
watch = [
    {"symbol": "RELIANCE", "exchange": "NSE"},
    {"symbol": "TCS", "exchange": "NSE"},
    {"symbol": "INFY", "exchange": "NSE"},
    {"symbol": "NIFTY30JUN26FUT", "exchange": "NFO"},
]

resp = client.multiquotes(symbols=watch)
movers = []
for r in resp["results"]:
    d = r["data"]
    chg = (d["ltp"] - d["prev_close"]) / d["prev_close"] * 100 if d["prev_close"] else 0
    movers.append((r["symbol"], r["exchange"], d["ltp"], round(chg, 2)))

movers.sort(key=lambda x: x[3], reverse=True)
print(f"{'SYMBOL':20s}{'EXCH':6s}{'LTP':>12s}{'CHG%':>9s}")
for sym, ex, ltp, chg in movers:
    print(f"{sym:20s}{ex:6s}{ltp:>12.2f}{chg:>8.2f}%")
