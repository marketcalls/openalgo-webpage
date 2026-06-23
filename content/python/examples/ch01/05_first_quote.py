# Your first live data pull: a price quote for one stock.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

q = client.quotes(symbol="RELIANCE", exchange="NSE")["data"]
print("RELIANCE last traded price:", q["ltp"])
print("Open / High / Low:", q["open"], q["high"], q["low"])
print("Previous close   :", q["prev_close"])
