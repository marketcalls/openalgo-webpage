import os

import requests

host = os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000")
api_key = os.getenv("OPENALGO_API_KEY", "your_api_key_here")

# OpenAlgo's REST API: POST a small JSON body, get a JSON response back.
resp = requests.post(
    f"{host}/api/v1/quotes",
    json={"apikey": api_key, "symbol": "RELIANCE", "exchange": "NSE"},
    timeout=10,
)

print("Status code :", resp.status_code)          # 200 = the request succeeded
quote = resp.json()
print("Status      :", quote["status"])           # "success"
print("Fields      :", list(quote["data"].keys()))
print("LTP (live)  :", quote["data"]["ltp"])       # fills with the live price in market hours
