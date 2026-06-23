# The greeks: delta, gamma, theta, vega -- how an option's price will move.
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

# Resolve the ATM call, then ask for its greeks.
sym = client.optionsymbol(underlying="NIFTY", exchange="NSE_INDEX",
                          expiry_date=expiry, offset="ATM", option_type="CE")["symbol"]
g = client.optiongreeks(symbol=sym, exchange="NFO", interest_rate=0.0,
                        underlying_symbol="NIFTY", underlying_exchange="NSE_INDEX")

print("Option        :", sym)
print("Days to expiry:", round(g["days_to_expiry"], 1))
print("Implied vol % :", g["implied_volatility"])
gk = g["greeks"]
print("\nDelta:", gk["delta"], " (price move per 1 pt of NIFTY)")
print("Gamma:", gk["gamma"], "(how fast delta changes)")
print("Theta:", gk["theta"], " (rupees lost to time decay per day)")
print("Vega :", gk["vega"], " (price move per 1% change in IV)")
