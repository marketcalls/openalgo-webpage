# Indices live on the NSE_INDEX exchange and are quote-only (you cannot trade them directly).
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

for idx in ["NIFTY", "BANKNIFTY", "FINNIFTY", "INDIAVIX"]:
    q = client.quotes(symbol=idx, exchange="NSE_INDEX")["data"]
    print(f"{idx:12s} {q['ltp']:>10.2f}")
