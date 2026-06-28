# Walk a real L5 order book to price the market-impact cost of a sized market order.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Prefer a live book: MCX near-month future (trades into the night), then a liquid NSE name.
CANDIDATES = [("CRUDEOIL20JUL26FUT", "MCX"), ("RELIANCE", "NSE"), ("SBIN", "NSE")]
ORDER_QTY = 40  # units to BUY at market (lots for the future, shares for the stock)


def resolve_book(cands):
    # Use the first candidate whose live L5 has real prices and quantities on both sides.
    for sym, exch in cands:
        d = client.depth(symbol=sym, exchange=exch).get("data", {})
        asks = [a for a in d.get("asks", []) if a["price"] > 0 and a["quantity"] > 0]
        bids = [b for b in d.get("bids", []) if b["price"] > 0 and b["quantity"] > 0]
        if asks and bids:
            return sym, exch, bids, asks, float(d["ltp"]), True
    # Off-hours the book is empty: reconstruct an illustrative ladder around the REAL last price.
    sym, exch = cands[0]
    ltp = float(client.depth(symbol=sym, exchange=exch)["data"]["ltp"])
    profile = [6, 10, 14, 20, 30]  # a typical thinning depth profile
    asks = [{"price": ltp + i, "quantity": q} for i, q in enumerate(profile, start=1)]
    bids = [{"price": ltp - i, "quantity": q} for i, q in enumerate(profile, start=1)]
    return sym, exch, bids, asks, ltp, False


sym, exch, bids, asks, ltp, is_live = resolve_book(CANDIDATES)
mid = (bids[0]["price"] + asks[0]["price"]) / 2

# Walk the ASK side: fill the buy order level by level until the size is met.
need, cost, filled = ORDER_QTY, 0.0, 0
for lvl in asks:
    take = min(need, lvl["quantity"])
    cost += take * lvl["price"]
    filled, need = filled + take, need - take
    if need <= 0:
        break

avg_fill = cost / filled
impact_bps = (avg_fill - mid) / mid * 1e4
half_spread_bps = (asks[0]["price"] - mid) / mid * 1e4
walk_bps = impact_bps - half_spread_bps

tag = "LIVE book" if is_live else "live book CLOSED - illustrative ladder around real LTP"
print(f"{sym} ({exch})  {tag}  mid {mid:.2f}")
print(f"Market buy {filled}/{ORDER_QTY} units -> avg fill {avg_fill:.2f} vs mid {mid:.2f}")
print(f"Impact {avg_fill - mid:.2f} = {impact_bps:.1f} bps "
      f"({half_spread_bps:.1f} bps half-spread + {walk_bps:.1f} bps walking the book)")
