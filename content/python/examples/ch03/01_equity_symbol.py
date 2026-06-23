# Equity symbols are just the base name: RELIANCE, SBIN, INFY.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

info = client.symbol(symbol="RELIANCE", exchange="NSE")["data"]
print("Symbol    :", info["symbol"])
print("Name      :", info["name"])
print("Lot size  :", info["lotsize"])
print("Tick size :", info["tick_size"])
