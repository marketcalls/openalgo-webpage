# The bid-ask spread is your hidden cost on every trade. Tighter is cheaper.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

d = client.depth(symbol="GOLDM03JUL26FUT", exchange="MCX")["data"]
best_bid = d["bids"][0]["price"] if d["bids"] else 0
best_ask = d["asks"][0]["price"] if d["asks"] else 0
print("Best bid:", best_bid, "| best ask:", best_ask)

if best_bid and best_ask:
    spread = best_ask - best_bid
    print("Spread  :", round(spread, 2), f"({spread / best_ask * 100:.3f}%)")
else:
    print("Market is closed -- no live bids/asks right now.")
