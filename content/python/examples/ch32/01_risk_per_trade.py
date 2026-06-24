# The first rule of sizing: decide how much you can LOSE before how much you can buy.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

RISK_PCT = 1.0          # risk at most 1% of capital on any single trade

capital = float(client.funds()["data"]["availablecash"])
risk_amount = capital * RISK_PCT / 100

print(f"Available capital : {capital:>13,.2f}")
print(f"Risk per trade    : {RISK_PCT:.1f}%  ->  {risk_amount:>10,.2f} rupees")
print("\nThat rupee figure - not a share count - is the real budget for one trade.")
