# One NIFTY future: notional, a rough SPAN band, and the REAL SPAN + exposure margin.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SYM, EXCH, LOT = "NIFTY28JUL26FUT", "NFO", 65  # NIFTY lot size = 65

ltp = client.quotes(symbol=SYM, exchange=EXCH)["data"]["ltp"]
notional = ltp * LOT

# A rough eyeball band before asking the broker: index futures sit near ~11% of notional.
rough = 0.11 * notional

# The REAL number: SPAN (worst-case scan) + exposure margin, from the OpenAlgo margin API.
m = client.margin(positions=[{
    "symbol": SYM, "exchange": EXCH, "action": "BUY",
    "product": "NRML", "pricetype": "MARKET", "quantity": str(LOT), "price": "0",
}])["data"]
span, exp, total = m["span_margin"], m["exposure_margin"], m["total_margin_required"]

print(f"{SYM}  ({LOT} qty = 1 lot)")
print(f"Last price          : Rs {ltp:,.2f}")
print(f"Notional controlled : Rs {notional:,.0f}  (= {ltp:,.2f} x {LOT})")
print(f"Rough SPAN band     : Rs {rough:,.0f}  (~11% eyeball)")
print(f"SPAN margin (real)  : Rs {span:,.0f}")
print(f"Exposure margin     : Rs {exp:,.0f}")
print(f"Total margin        : Rs {total:,.0f}  ({total / notional * 100:.1f}% of notional)")
print(f"Implied leverage    : {notional / total:.2f}x")
print(f"\nOne NIFTY lot controls Rs {notional:,.0f} of index on Rs {total:,.0f} of margin "
      f"- {notional / total:.1f}x leverage.")
