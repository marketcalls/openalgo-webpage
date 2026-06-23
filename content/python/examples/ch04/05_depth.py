# depth() returns the order book: the best buy (bid) and sell (ask) levels.
# We use an MCX commodity here so the book is live in the evening session.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

d = client.depth(symbol="CRUDEOIL20JUL26FUT", exchange="MCX")["data"]
print("LTP:", d["ltp"], "| total buy:", d["totalbuyqty"], "| total sell:", d["totalsellqty"])
print("Bids (buyers)        Asks (sellers)")
for bid, ask in zip(d["bids"][:5], d["asks"][:5]):
    print(f"  {bid['price']:>9.2f} x {bid['quantity']:<6}  {ask['price']:>9.2f} x {ask['quantity']}")
