# Multilateral netting: many gross trades collapse to ONE settlement obligation.
import os
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# A day-trader churns RELIANCE all session. Use real 15m bars from one day,
# one trade per bar: buy a green bar, sell a red bar, fixed 100 shares each.
day = "2026-06-25"
bars = client.history(symbol="RELIANCE", exchange="NSE", interval="15m",
                      start_date=day, end_date=day)
qty = 100

buy_qty = buy_val = sell_qty = sell_val = 0
gross_turnover = 0.0
for _, b in bars.iterrows():
    price = float(b["close"])
    gross_turnover += price * qty
    if b["close"] >= b["open"]:
        buy_qty += qty
        buy_val += price * qty
    else:
        sell_qty += qty
        sell_val += price * qty

net_qty = buy_qty - sell_qty                 # single securities obligation
net_funds = sell_val - buy_val               # single funds obligation (+receive / -pay)
side = "RECEIVE" if net_funds >= 0 else "PAY"

print(f"RELIANCE {day}: {len(bars)} gross trades simulated from real 15m bars")
print(f"  Bought {buy_qty} sh for Rs {buy_val:,.0f} | Sold {sell_qty} sh for Rs {sell_val:,.0f}")
print(f"  Gross turnover that crossed the tape: Rs {gross_turnover:,.0f}")
print(f"  Settled trade-by-trade that is {len(bars)} separate obligations")
print(f"  After multilateral netting: deliver/receive {net_qty:+d} shares, "
      f"{side} Rs {abs(net_funds):,.0f} - ONE obligation")
print(f"Netting compressed Rs {gross_turnover:,.0f} of gross flow into a single "
      f"Rs {abs(net_funds):,.0f} settlement ({abs(net_funds)/gross_turnover*100:.1f}% of gross).")
