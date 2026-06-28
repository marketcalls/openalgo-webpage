# The cash-futures basis and the annualised carry it implies (cost-of-carry / Black-76).
import os
from datetime import date
from math import log

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Near monthly contract: NIFTY future expiring 28 Jul 2026.
EXPIRY = date(2026, 7, 28)
spot = client.quotes(symbol="NIFTY", exchange="NSE_INDEX")["data"]["ltp"]
fut = client.quotes(symbol="NIFTY28JUL26FUT", exchange="NFO")["data"]["ltp"]

basis = fut - spot                       # points the future trades above spot
days = (EXPIRY - date.today()).days      # calendar days to expiry
T = days / 365.0
# F = S * exp(carry * T)  ->  carry = ln(F/S) / T  (net of dividend yield)
carry = log(fut / spot) / T

print(f"NIFTY spot            : {spot:.2f}")
print(f"NIFTY 28JUL26 future  : {fut:.2f}")
print(f"Basis (future - spot) : {basis:+.2f} pts  ({basis / spot * 100:+.2f}% of spot)")
print(f"Days to expiry        : {days}")
print(f"Annualised net carry  : {carry * 100:.2f}%   (rate minus dividend yield)")
print(
    f"SUMMARY: basis {basis:+.1f} pts over {days} days implies "
    f"{carry * 100:.2f}% annualised carry."
)
