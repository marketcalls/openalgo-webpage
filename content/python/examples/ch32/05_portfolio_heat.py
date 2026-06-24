# Portfolio heat: the TOTAL risk across all open trades - cap it, or one bad day stings.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

MAX_HEAT_PCT = 6.0       # never have more than 6% of capital at risk at once

capital = float(client.funds()["data"]["availablecash"])

# Each open position as (symbol, quantity, entry, stop)
open_positions = [
    ("RELIANCE", 40, 1400.0, 1372.0),
    ("INFY", 30, 1550.0, 1520.0),
    ("TATASTEEL", 200, 150.0, 146.0),
]

heat = 0.0
for sym, qty, entry, stop in open_positions:
    risk = qty * (entry - stop)
    heat += risk
    print(f"{sym:12s} risk {risk:>10,.2f}  ({risk / capital * 100:.2f}% of capital)")

heat_pct = heat / capital * 100
print(f"\nTotal open risk (heat): {heat:,.2f}  =  {heat_pct:.2f}% of capital")
if heat_pct > MAX_HEAT_PCT:
    print(f"OVER the {MAX_HEAT_PCT:.0f}% limit - trim or close a position before adding another.")
else:
    print(f"Within the {MAX_HEAT_PCT:.0f}% limit - room for {MAX_HEAT_PCT - heat_pct:.2f}% more risk.")
