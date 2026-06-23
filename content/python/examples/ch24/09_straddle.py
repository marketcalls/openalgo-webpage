# A long straddle: buy the ATM call AND the ATM put -- a bet on a big move.
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

# Both legs at the same ATM strike, both BUY -- profits if NIFTY moves far either way.
resp = client.optionsmultiorder(
    strategy="ch24-straddle", underlying="NIFTY", exchange="NSE_INDEX", expiry_date=expiry,
    legs=[
        {"offset": "ATM", "option_type": "CE", "action": "BUY", "quantity": 65, "product": "NRML"},
        {"offset": "ATM", "option_type": "PE", "action": "BUY", "quantity": 65, "product": "NRML"},
    ],
)

print("Long straddle on NIFTY", expiry, "| overall:", resp["status"])
for leg in resp["results"]:
    print(f"  {leg['option_type']} leg: BUY {leg['symbol']:<22} -> {leg['status']}")
print("\nMax loss is the combined premium; profit grows once price moves past it.")
