# Reconciliation: rebuild position from your fills, compare to the broker, flag the break.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Real fill prices: take the first few 5-minute closes from the latest RELIANCE session.
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")
bars = client.history(symbol="RELIANCE", exchange="NSE", interval="5m",
                      start_date=start, end_date=end)
day = bars.index[-1].date()
px = bars[bars.index.date == day]["close"].round(2).tolist()

# What our system THINKS happened: its own record of the day's fills (signed qty).
internal_fills = [
    ("BUY",  500, px[0]),
    ("BUY",  500, px[1]),
    ("SELL", 500, px[2]),
    ("BUY",  500, px[3]),
]
# What the BROKER actually filled: an extra 500-share buy our feed handler dropped.
broker_fills = internal_fills + [("BUY", 500, px[4])]


def net_position(fills):
    qty = sum(q if side == "BUY" else -q for side, q, _ in fills)
    cost = sum((q if side == "BUY" else -q) * p for side, q, p in fills)
    return qty, cost


int_qty, int_cost = net_position(internal_fills)
brk_qty, brk_cost = net_position(broker_fills)
break_qty = brk_qty - int_qty

print(f"Session {day}  symbol RELIANCE (NSE)")
print(f"Internal position : {int_qty:+5d} sh  net cost Rs {int_cost:>12,.2f}  ({len(internal_fills)} fills)")
print(f"Broker position   : {brk_qty:+5d} sh  net cost Rs {brk_cost:>12,.2f}  ({len(broker_fills)} fills)")
print(f"RECONCILE BREAK   : {break_qty:+5d} sh  Rs {brk_cost - int_cost:>12,.2f}  -> HALT new orders, investigate")
print(f"\nA {abs(break_qty)}-share break means one real fill never reached our books - flatten on the broker number, not ours.")
