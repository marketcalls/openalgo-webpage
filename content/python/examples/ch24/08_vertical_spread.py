# A bull call spread: buy the ATM call, sell a higher call to cut the cost.
import os
from datetime import datetime

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

dates = client.expiry(symbol="NIFTY", exchange="NFO", instrumenttype="options")["data"]
today = datetime.now().date()
nearest = sorted(d for d in (datetime.strptime(x, "%d-%b-%y").date() for x in dates) if d > today)[0]
expiry = nearest.strftime("%d%b%y").upper()

# Two legs sent together. product NRML on each leg avoids intraday square-off.
resp = client.optionsmultiorder(
    strategy="ch24-bull-call", underlying="NIFTY", exchange="NSE_INDEX", expiry_date=expiry,
    legs=[
        {"offset": "ATM", "option_type": "CE", "action": "BUY", "quantity": 65, "product": "NRML"},
        {"offset": "OTM3", "option_type": "CE", "action": "SELL", "quantity": 65, "product": "NRML"},
    ],
)

print("Bull call spread on NIFTY", expiry, "| overall:", resp["status"])
for leg in resp["results"]:
    print(f"  leg {leg['leg']}: {leg['action']:<4} {leg['symbol']:<22} -> {leg['status']}")
