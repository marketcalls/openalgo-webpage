# What each order type would do for a long trade, built from a real live LTP.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SYMBOL, EXCHANGE, TICK = "RELIANCE", "NSE", 0.05
ltp = client.quotes(symbol=SYMBOL, exchange=EXCHANGE)["data"]["ltp"]


def to_tick(p):  # snap a price to the exchange tick size
    return round(round(p / TICK) * TICK, 2)


# A long-trade plan framed around the live last-traded price. No order is placed.
limit_entry = to_tick(ltp * 0.997)        # patient buy, a touch below the market
stop_trig = to_tick(ltp * 0.99)           # protective stop trigger, 1% below
stop_limit = to_tick(stop_trig - 0.5)     # SL limit price, just below the trigger
target = to_tick(ltp * 1.02)              # profit target, 2% above

print(f"{SYMBOL}  {EXCHANGE}   LTP {ltp:.2f}   (tick {TICK})\n")
print(f"{'Order type':<14}{'Side':<6}{'Trigger':>10}{'Price':>10}   Behaviour")
rows = [
    ("MARKET", "BUY", None, ltp, "fills now at best available, pays the spread"),
    ("LIMIT", "BUY", None, limit_entry, "rests in book, fills only at <= limit"),
    ("SL", "SELL", stop_trig, stop_limit, "protective stop, wakes at trigger then limit"),
    ("SL-M", "SELL", stop_trig, None, "protective stop, wakes at trigger then market"),
    ("TARGET (LIMIT)", "SELL", None, target, "books profit, fills only at >= price"),
]
for name, side, trig, price, note in rows:
    t = f"{trig:.2f}" if trig is not None else "-"
    p = f"{price:.2f}" if price is not None else "market"
    print(f"{name:<14}{side:<6}{t:>10}{p:>10}   {note}")

risk = round(limit_entry - stop_limit, 2)
reward = round(target - limit_entry, 2)
print(f"\nLimit entry {limit_entry:.2f}: risk/share {risk:.2f}, reward/share {reward:.2f}, "
      f"reward-to-risk {reward / risk:.2f} to 1")
