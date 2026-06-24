# The indices everyone watches, on one board - the pulse of the Indian market.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

indices = [
    ("NIFTY", "NSE_INDEX"),       # the broad large-cap benchmark
    ("BANKNIFTY", "NSE_INDEX"),   # banks - the market's engine room
    ("FINNIFTY", "NSE_INDEX"),    # wider financials
    ("NIFTYIT", "NSE_INDEX"),     # the IT sector
    ("INDIAVIX", "NSE_INDEX"),    # the fear gauge
    ("SENSEX", "BSE_INDEX"),      # the BSE benchmark
]

print(f"{'INDEX':12s}{'LTP':>12s}{'DAY%':>9s}")
for sym, exch in indices:
    d = client.quotes(symbol=sym, exchange=exch)["data"]
    # change from the day's open (always meaningful, even after the close)
    pct = (d["ltp"] - d["open"]) / d["open"] * 100 if d.get("open") else 0
    print(f"{sym:12s}{d['ltp']:>12.2f}{pct:>8.2f}%")

print("\nDifferent indices, different stories - the market is never one thing.")
