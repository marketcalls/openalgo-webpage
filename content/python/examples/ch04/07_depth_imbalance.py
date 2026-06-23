# Total buy vs sell quantity hints at short-term pressure in the book.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

d = client.depth(symbol="CRUDEOIL20JUL26FUT", exchange="MCX")["data"]
buy_qty, sell_qty = d["totalbuyqty"], d["totalsellqty"]
total = buy_qty + sell_qty

print("Total buy qty :", buy_qty)
print("Total sell qty:", sell_qty)
if total:
    print("Buy pressure  :", f"{buy_qty / total * 100:.1f}%")
