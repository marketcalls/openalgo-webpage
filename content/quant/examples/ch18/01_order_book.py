# The order book: the live queue of who wants to buy and sell, and at what price.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# MCX commodities trade into the night, so the book is live even after NSE/BSE close.
SYMBOL, EXCHANGE = "CRUDEOIL20JUL26FUT", "MCX"
d = client.depth(symbol=SYMBOL, exchange=EXCHANGE)["data"]

print(f"{SYMBOL}   LTP {d['ltp']}\n")
print(f"{'BID qty':>9s}{'BID':>10s}   |   {'ASK':<10s}{'ASK qty':<9s}")
for bid, ask in zip(d["bids"], d["asks"]):
    print(f"{bid['quantity']:>9d}{bid['price']:>10.1f}   |   {ask['price']:<10.1f}{ask['quantity']:<9d}")

best_bid, best_ask = d["bids"][0]["price"], d["asks"][0]["price"]
print(f"\nBest bid {best_bid}  |  Best ask {best_ask}  |  Spread {best_ask - best_bid:.1f}")
print(f"Resting buy qty {d['totalbuyqty']}  vs  sell qty {d['totalsellqty']}  - a rough read on pressure")
