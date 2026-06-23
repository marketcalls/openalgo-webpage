# Buying options: a long call (bet up) and a long put (bet down), simulated.
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

# offset resolves the strike for us; product NRML = carry (no intraday cutoff).
call = client.optionsorder(strategy="ch24", underlying="NIFTY", exchange="NSE_INDEX",
                           expiry_date=expiry, offset="ATM", option_type="CE", action="BUY",
                           quantity=65, pricetype="MARKET", product="NRML", splitsize=0)
put = client.optionsorder(strategy="ch24", underlying="NIFTY", exchange="NSE_INDEX",
                          expiry_date=expiry, offset="ATM", option_type="PE", action="BUY",
                          quantity=65, pricetype="MARKET", product="NRML", splitsize=0)

print("Bought CALL:", call["symbol"], "| status:", call["status"], "| id:", call["orderid"])
print("Bought PUT :", put["symbol"], "| status:", put["status"], "| id:", put["orderid"])
print("\nMode:", call.get("mode", "live"), "-- nothing real was traded.")
