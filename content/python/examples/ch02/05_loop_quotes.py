# Loop over a watchlist and pull each live price from OpenAlgo.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

for sym in ["RELIANCE", "TCS", "INFY"]:
    ltp = client.quotes(symbol=sym, exchange="NSE")["data"]["ltp"]
    print(f"{sym:10s} {ltp:>10.2f}")
