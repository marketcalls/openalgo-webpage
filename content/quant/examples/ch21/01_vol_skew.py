# Implied volatility isn't flat across strikes - it skews. India VIX sums it all up.
import os
import time

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

vix = client.quotes(symbol="INDIAVIX", exchange="NSE_INDEX")["data"]["ltp"]
print(f"India VIX (the market's 30-day implied volatility): {vix}%\n")

print(f"{'STRIKE':>8s}{'IV %':>9s}")
for strike in range(23400, 24701, 100):
    r = client.optiongreeks(symbol=f"NIFTY30JUN26{strike}CE", exchange="NFO", interest_rate=0.0,
                            underlying_symbol="NIFTY", underlying_exchange="NSE_INDEX")
    iv = r.get("implied_volatility")
    if iv:
        print(f"{strike:>8d}{iv:>9.2f}")
    time.sleep(0.3)

print("\nLower strikes carry HIGHER implied vol - the 'skew' - because crash insurance (puts) is dear.")
