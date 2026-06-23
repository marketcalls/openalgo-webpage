# Synthetic future: the future's fair value built from ATM call and put prices.
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

sf = client.syntheticfuture(underlying="NIFTY", exchange="NSE_INDEX", expiry_date=expiry)
spot = sf["underlying_ltp"]
fair = sf["synthetic_future_price"]
basis = round(fair - spot, 2)

print("Expiry              :", sf["expiry"])
print("Spot (NIFTY index)  :", spot)
print("ATM strike          :", sf["atm_strike"])
print("Synthetic future    :", fair)
print("Basis (fair - spot) :", basis, "points")
print("\nBasis = the cost of carry to expiry; close to flat near expiry, and it")
print("can flip slightly negative once near-term carry and dividends net out.")
