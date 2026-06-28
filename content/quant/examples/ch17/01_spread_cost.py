# The gap between the chart price and your fill: the spread in rupees, basis points and round-trip cost.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# A near-month MCX crude future: deeply liquid, and it trades into the night.
SYMBOL, EXCHANGE = "CRUDEOIL20JUL26FUT", "MCX"
tick = client.symbol(symbol=SYMBOL, exchange=EXCHANGE)["data"]["tick_size"]

d = client.depth(symbol=SYMBOL, exchange=EXCHANGE)["data"]
bid, ask = d["bids"][0]["price"], d["asks"][0]["price"]

if bid > 0 and ask > 0:
    # Live book: the spread is the real distance between best bid and best ask.
    source = "live L5 book"
    spread = ask - bid
    mid = (bid + ask) / 2.0
else:
    # Book is shut, so we cannot see it. Proxy the spread by how far price
    # travels inside a typical one-minute bar (an honest upper bracket).
    source = "range proxy (book shut)"
    df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="1m",
                        start_date="2026-06-25", end_date="2026-06-27")
    df = df[df["volume"] > 0]
    spread = float((df["high"] - df["low"]).median())
    mid = float(df["close"].iloc[-1])

spread_bps = spread / mid * 1e4
floor_bps = tick / mid * 1e4                 # the tightest the spread can ever be: one tick
round_trip = spread_bps / 1e4 * 100000       # cross in at ask, out at bid, on Rs 1,00,000 traded

print(f"{SYMBOL}  ({source})")
print(f"Mid ~ {mid:.1f}   tick size Rs {tick:g}  ({floor_bps:.1f} bps floor)")
print(f"Spread        Rs {spread:.1f}   =  {spread_bps:.1f} bps of price")
print(f"Round trip    forfeit the full spread in and out  =  Rs {round_trip:.0f} per Rs 1,00,000 traded")
