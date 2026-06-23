# Futures and options quotes also carry open interest (OI) -- live contracts outstanding.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

q = client.quotes(symbol="NIFTY30JUN26FUT", exchange="NFO")["data"]
print("NIFTY future LTP :", q["ltp"])
print("Open interest    :", q["oi"])
print("Volume           :", q["volume"])
