# Order-to-trade ratio of an honest two-sided market maker on a real price tape.
import os

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# The real intraday tape sets the re-quote and fill rhythm.
df = client.history(symbol="RELIANCE", exchange="NSE", interval="1m",
                    start_date="2026-06-23", end_date="2026-06-27")
close = df["close"].dropna()

# A two-sided maker cancels and replaces both quotes every time the mid moves.
move = close.diff().fillna(0.0)
requotes = int((move != 0).sum())          # one re-quote event per mid change
order_msgs = 2 * requotes                   # bid and ask each refreshed

# Fills land at turning points: a resting bid is hit on a dip, an ask on a pop.
sign = np.sign(move.values)
nz = sign[sign != 0]
turns = int((np.diff(nz) != 0).sum())
rng = np.random.default_rng(7)              # not every turn reaches the front of our queue
fills = int(rng.binomial(turns, 0.6))

otr = order_msgs / max(fills, 1)
THRESHOLD = 50.0                            # illustrative band; real slabs are exchange-set and revised
headroom = THRESHOLD / otr

print(f"RELIANCE 1m tape : {len(close)} bars, {requotes} mid moves, {fills} fills")
print(f"Order messages   : {order_msgs}   Trades : {fills}")
print(f"Order-to-trade   : {otr:.1f} : 1   (illustrative penalty band starts near {THRESHOLD:.0f}:1)")
status = "within limits" if otr < THRESHOLD else "IN PENALTY ZONE"
print(f"Status: {status} - room for {headroom:.1f}x more order messages per fill before the band trips.")
