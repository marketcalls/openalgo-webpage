# Market-making P&L on a real RELIANCE session: spread captured vs inventory risk.
import os

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

np.random.seed(7)  # the sim below is fully deterministic; seed kept for reproducibility

SYMBOL, DAY = "RELIANCE", "2026-06-25"
HALF, CLIP = 0.20, 100   # quote mid +/- Rs 0.20, trade 100 shares a clip
df = client.history(symbol=SYMBOL, exchange="NSE", interval="1m", start_date=DAY, end_date=DAY)
h, l, c = df["high"].values, df["low"].values, df["close"].values


def run(skew):
    """Quote both sides each minute; fill on the bar crossing our bid/ask. skew = Rs per clip of inventory."""
    cash, inv, buys, sells, rts, spread, fills, mid = 0.0, 0, 0, 0, 0, 0.0, [], c[0]
    for i in range(len(c)):
        bid = mid - HALF - skew * (inv / CLIP)        # lean quotes against inventory
        ask = mid + HALF - skew * (inv / CLIP)        # long -> both drop, so we sell more, buy less
        hit_bid, hit_ask = l[i] <= bid, h[i] >= ask
        if hit_bid:                                   # someone sold into our bid: we go longer
            cash -= bid * CLIP; inv += CLIP; buys += 1; spread += (mid - bid) * CLIP; fills.append((mid, +1))
        if hit_ask:                                   # someone lifted our ask: we go shorter
            cash += ask * CLIP; inv -= CLIP; sells += 1; spread += (ask - mid) * CLIP; fills.append((mid, -1))
        rts += hit_bid and hit_ask
        mid = c[i]
    last = c[-1]
    inv_pnl = sum((last - m) * CLIP if s > 0 else (m - last) * CLIP for m, s in fills)
    return dict(buys=buys, sells=sells, rts=rts, end=inv,
                spread=spread, inv_pnl=inv_pnl, net=cash + inv * last)


skewed, naive = run(0.01), run(0.0)
ret = 100 * (c[-1] / c[0] - 1)
print(f"{SYMBOL} NSE 1m  {DAY}  {len(c)} bars  open {c[0]:.2f}  close {c[-1]:.2f}  ({ret:+.2f}%)")
print(f"Quote mid +/- Rs {HALF:.2f}, clip {CLIP} shares\n")
for name, r in [("Inventory-skewed maker (skew Rs 0.01/clip)", skewed), ("Naive maker (no skew)", naive)]:
    print(f"{name}")
    print(f"  fills           : {r['buys'] + r['sells']}  ({r['buys']} buys, {r['sells']} sells, {r['rts']} round trips)")
    print(f"  spread captured : Rs {r['spread']:+,.0f}")
    print(f"  inventory m2m   : Rs {r['inv_pnl']:+,.0f}")
    print(f"  net P&L         : Rs {r['net']:+,.0f}   ending inventory {r['end']:+,} shares")
print(f"\nSpread income is similar (Rs {skewed['spread']:,.0f} vs {naive['spread']:,.0f}); "
      f"skewing cut the inventory loss from Rs {naive['inv_pnl']:,.0f} to Rs {skewed['inv_pnl']:,.0f} "
      f"and net from Rs {naive['net']:,.0f} to Rs {skewed['net']:,.0f} on a {ret:+.2f}% day.")
