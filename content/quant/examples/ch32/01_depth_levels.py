# Snapshot depth: what L1 (top of book) shows vs the full L2 ladder.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Primary: an MCX near-month future (commodities trade into the night). Fall back
# to a liquid NSE name. Either way we ask for a real L5 depth snapshot.
TARGETS = [("CRUDEOIL20JUL26FUT", "MCX", 1.0), ("RELIANCE", "NSE", 0.1)]

for SYMBOL, EXCHANGE, TICK in TARGETS:
    d = client.depth(symbol=SYMBOL, exchange=EXCHANGE).get("data") or {}
    if d:
        break

ltp = float(d["ltp"])
live = (d.get("totalbuyqty", 0) or 0) + (d.get("totalsellqty", 0) or 0) > 0

if live:
    bids, asks = d["bids"], d["asks"]
    note = "live exchange depth"
else:
    # Off-hours the broadcast carries the real last price but an empty book. We
    # reconstruct an ILLUSTRATIVE 5-level ladder around the genuine LTP so the
    # shape of L1 vs L2 is visible. The quantities below are illustrative only.
    bid_q, ask_q = [3, 12, 18, 25, 31], [9, 14, 11, 20, 28]
    bids = [{"price": ltp - i * TICK, "quantity": q} for i, q in enumerate(bid_q)]
    asks = [{"price": ltp + (i + 1) * TICK, "quantity": q} for i, q in enumerate(ask_q)]
    note = f"illustrative ladder around the REAL last price {ltp:g} (live book empty off-hours)"

print(f"{SYMBOL}  LTP {ltp:g}   [{note}]\n")
print("L1  - top of book, all most feeds give you for free:")
print(f"     best bid {bids[0]['price']:g} x {bids[0]['quantity']}   |   "
      f"best ask {asks[0]['price']:g} x {asks[0]['quantity']}   spread {asks[0]['price']-bids[0]['price']:g}\n")

print("L2  - the full 5-deep ladder, the queue behind the touch:")
print(f"{'BID qty':>9s}{'BID':>9s}   |   {'ASK':<9s}{'ASK qty':<9s}")
for b, a in zip(bids, asks):
    print(f"{b['quantity']:>9d}{b['price']:>9g}   |   {a['price']:<9g}{a['quantity']:<9d}")

depth_bid = sum(b["quantity"] for b in bids)
print(f"\nL1 shows {bids[0]['quantity']} lots bid; L2 reveals {depth_bid} resting below the touch "
      f"- {depth_bid - bids[0]['quantity']} lots L1 hides.")
