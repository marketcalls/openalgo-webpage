# multiquotes() fetches many symbols in a single request -- far faster than a loop.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

symbols = [{"symbol": s, "exchange": "NSE"} for s in ["RELIANCE", "TCS", "INFY", "HDFCBANK"]]
results = client.multiquotes(symbols=symbols)["results"]

for r in results:
    print(f"{r['symbol']:10s} {r['data']['ltp']:>10.2f}")
