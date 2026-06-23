# A reusable quote board across exchanges -- the heart of any dashboard.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def quote_board(items):
    print(f"{'EXCH':5s}{'SYMBOL':20s}{'LTP':>12s}{'CHG%':>9s}")
    for r in client.multiquotes(symbols=items)["results"]:
        d = r["data"]
        pct = (d["ltp"] - d["prev_close"]) / d["prev_close"] * 100 if d["prev_close"] else 0
        print(f"{r['exchange']:5s}{r['symbol']:20s}{d['ltp']:>12.2f}{pct:>8.2f}%")


quote_board([
    {"symbol": "RELIANCE", "exchange": "NSE"},
    {"symbol": "NIFTY30JUN26FUT", "exchange": "NFO"},
    {"symbol": "CRUDEOIL20JUL26FUT", "exchange": "MCX"},
])
