# Turn a rupee risk budget into a share quantity using the distance to your stop.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

RISK_PCT = 1.0
SYMBOL, EXCHANGE = "RELIANCE", "NSE"

capital = float(client.funds()["data"]["availablecash"])
risk_amount = capital * RISK_PCT / 100

entry = client.quotes(symbol=SYMBOL, exchange=EXCHANGE)["data"]["ltp"]
stop = entry * 0.98                        # a 2% stop, for illustration
risk_per_share = entry - stop

qty = int(risk_amount // risk_per_share)    # whole shares only, always round down

print(f"Entry        : {entry:.2f}")
print(f"Stop         : {stop:.2f}   (risk/share = {risk_per_share:.2f})")
print(f"Risk budget  : {risk_amount:,.2f}")
print(f"-> Quantity  : {qty}   (worst-case loss if stopped = {qty * risk_per_share:,.2f})")
print("\nWiden the stop and the quantity shrinks - risk stays pinned to your budget.")
