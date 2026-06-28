# Where Nifty option liquidity lives: open interest by strike around the money.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Pull the 28-Jul-2026 monthly chain: every strike carries real-time OI and a quoted book.
r = client.optionchain(underlying="NIFTY", exchange="NSE_INDEX",
                       expiry_date="28JUL26", strike_count=6)
atm = r["atm_strike"]
ltp = r["underlying_ltp"]
chain = r["chain"]

print(f"NIFTY 28-Jul-2026 chain   spot {ltp}   ATM strike {atm:.0f}\n")
print(f"{'strike':>7}{'CE OI':>10}{'PE OI':>10}{'total OI':>11}{'CE spread':>11}")

book_open = False
for row in chain:
    s = row["strike"]
    ce, pe = row["ce"] or {}, row["pe"] or {}
    ce_oi, pe_oi = ce.get("oi", 0), pe.get("oi", 0)
    bid, ask = ce.get("bid", 0), ce.get("ask", 0)
    if bid > 0 and ask > 0:
        book_open = True
        spr = f"{ask - bid:.2f}"
    else:
        spr = "book shut"
    tag = "  <- ATM" if s == atm else ("  round" if s % 500 == 0 else "")
    print(f"{s:>7.0f}{ce_oi:>10}{pe_oi:>10}{ce_oi + pe_oi:>11}{spr:>11}{tag}")

# Find the fattest strike in this window and the round/500-multiple total.
tot = [(row["strike"], (row["ce"] or {}).get("oi", 0) + (row["pe"] or {}).get("oi", 0))
       for row in chain]
top_strike, top_oi = max(tot, key=lambda x: x[1])
if not book_open:
    print("\n(Quoted bid/ask are flat off-hours, so OI is the liquidity read here.)")
print(f"\nLiquidity piles at round strikes: {top_strike:.0f} carries {top_oi:,} contracts of OI, "
      f"far above the thin half-strikes between the hundreds.")
