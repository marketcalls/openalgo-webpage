# Hedging: own the future's upside but cap the downside by buying a put.
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

# Synthetic-long via a call, protected by an OTM put -- the put is the insurance.
resp = client.optionsmultiorder(
    strategy="ch24-protective-put", underlying="NIFTY", exchange="NSE_INDEX", expiry_date=expiry,
    legs=[
        {"offset": "ATM", "option_type": "CE", "action": "BUY", "quantity": 65, "product": "NRML"},
        {"offset": "OTM5", "option_type": "PE", "action": "BUY", "quantity": 65, "product": "NRML"},
    ],
)

print("Protected long on NIFTY", expiry, "| overall:", resp["status"])
for leg in resp["results"]:
    role = "upside (long call)" if leg["option_type"] == "CE" else "insurance (long put)"
    print(f"  {leg['symbol']:<22} {leg['action']:<4} -> {leg['status']:<8} {role}")
print("\nThe OTM put caps your loss below its strike, for the cost of its premium.")
