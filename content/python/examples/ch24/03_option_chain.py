# The option chain: every strike's CE and PE around the at-the-money price.
import os
from datetime import datetime

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Discover the nearest expiry, then ask for 3 strikes either side of ATM.
dates = client.expiry(symbol="NIFTY", exchange="NFO", instrumenttype="options")["data"]
today = datetime.now().date()
nearest = sorted(d for d in (datetime.strptime(x, "%d-%b-%y").date() for x in dates) if d > today)[0]
expiry = nearest.strftime("%d%b%y").upper()

chain = client.optionchain(underlying="NIFTY", exchange="NSE_INDEX", expiry_date=expiry, strike_count=3)
print("Spot (underlying LTP):", chain["underlying_ltp"], "| ATM strike:", chain["atm_strike"])
print(f"\n{'Strike':>8} {'CE ltp':>8} {'CE lbl':>7} {'PE ltp':>8} {'PE lbl':>7}")
for row in chain["chain"]:
    ce, pe = row["ce"], row["pe"]
    print(f"{row['strike']:>8.0f} {ce['ltp']:>8} {ce['label']:>7} {pe['ltp']:>8} {pe['label']:>7}")
