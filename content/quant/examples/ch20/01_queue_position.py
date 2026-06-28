# Queue position at the best bid: how many lots sit ahead of you, and your fill odds.
import os
from datetime import date, timedelta

from openalgo import api
from scipy.stats import poisson

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# MCX near-month crude trades late, so its book is liveliest; fall back to a liquid NSE name.
# (symbol, exchange, lot size, tick size)
CANDIDATES = [
    ("CRUDEOIL20JUL26FUT", "MCX", 100, 1.0),
    ("RELIANCE", "NSE", 500, 0.05),
]
YOUR_LOTS = 5        # the passive BUY you want to rest at the best bid
SELL_SHARE = 0.5     # share of traded flow that arrives as sells hitting the bid
DEPTH_MINUTES = 2    # illustrative resting depth = this many minutes of real flow
HORIZON = 5          # minutes, the window for the fill-probability estimate


def recent_flow(symbol, exchange):
    end = date(2026, 6, 26)                        # last trading day (Friday)
    start = end - timedelta(days=10)
    return client.history(symbol=symbol, exchange=exchange, interval="1m",
                          start_date=start.isoformat(), end_date=end.isoformat())


for symbol, exchange, lot, tick in CANDIDATES:
    snap = client.depth(symbol=symbol, exchange=exchange).get("data", {})
    df = recent_flow(symbol, exchange)
    if df is None or len(df) == 0:
        continue
    flow = float(df["volume"].median())            # real lots traded per minute
    bids, asks = snap.get("bids", []), snap.get("asks", [])
    live = bool(bids) and bids[0].get("quantity", 0) > 0

    if live:                                        # market open: read the real touch
        best_bid = float(bids[0]["price"])
        ahead = float(bids[0]["quantity"])
        spread = float(asks[0]["price"]) - best_bid
        mode = "live book"
    else:                                           # off-hours: rebuild around the real last price
        ltp = float(snap.get("ltp") or df["close"].iloc[-1])
        best_bid = round(ltp / tick) * tick - tick
        spread = tick                               # a liquid contract trades about one tick wide
        ahead = round(DEPTH_MINUTES * flow)         # illustrative resting depth from real flow
        mode = "reconstructed (book closed; depth seeded from real 1m flow)"

    sell_rate = flow * SELL_SHARE                   # lots/min hitting the bid
    wait_front = ahead / sell_rate                  # time for the queue ahead to clear
    wait_full = (ahead + YOUR_LOTS) / sell_rate     # time to also fill your lots
    mu = sell_rate * HORIZON                         # expected sells over the horizon
    p_full = float(poisson.sf(ahead + YOUR_LOTS - 1, mu))   # P(N >= ahead + your lots)
    queue_value = (spread / 2.0) * lot              # half-spread earned per lot vs the mid

    print(f"{symbol}  [{mode}]")
    print(f"  best bid {best_bid:g}   spread {spread:g}   tick {tick:g}   lot {lot}")
    print(f"  resting ahead of you at the best bid : {ahead:.0f} lots")
    print(f"  your passive BUY joins the back      : {YOUR_LOTS} lots")
    print(f"  sell flow hitting the bid (real)     : {sell_rate:.1f} lots/min "
          f"(median {flow:.0f} lots/min traded)")
    print(f"  expected wait to reach the front     : {wait_front:.1f} min")
    print(f"  expected wait to fully fill          : {wait_full:.1f} min")
    print(f"  P(full fill within {HORIZON} min)            : {p_full * 100:.0f}%")
    print(f"  a good queue spot is worth           : Rs {queue_value:.0f}/lot "
          f"(Rs {queue_value * YOUR_LOTS:.0f} on {YOUR_LOTS} lots)")
    print(f"SUMMARY {symbol}: {ahead:.0f} lots ahead, ~{wait_front:.1f} min to the front, "
          f"~{p_full * 100:.0f}% full fill in {HORIZON} min, queue spot worth Rs {queue_value:.0f}/lot.")
    break
