# Future format: [Base][Expiry]FUT  e.g. NIFTY30JUN26FUT
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

info = client.symbol(symbol="NIFTY30JUN26FUT", exchange="NFO")["data"]
print("Symbol   :", info["symbol"])
print("Type     :", info["instrumenttype"])
print("Expiry   :", info["expiry"])
print("Lot size :", info["lotsize"])
print("Tick size:", info["tick_size"])
