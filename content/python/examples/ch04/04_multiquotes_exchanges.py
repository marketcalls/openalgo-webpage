# One multiquotes call can span NSE, NFO and MCX together.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

symbols = [
    {"symbol": "RELIANCE", "exchange": "NSE"},
    {"symbol": "NIFTY30JUN26FUT", "exchange": "NFO"},
    {"symbol": "GOLDM03JUL26FUT", "exchange": "MCX"},
]
for r in client.multiquotes(symbols=symbols)["results"]:
    print(f"{r['exchange']:4s} {r['symbol']:18s} {r['data']['ltp']:>12.2f}")
