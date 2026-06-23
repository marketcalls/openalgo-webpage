# The full life of a resting order: place it, modify the price, then cancel it.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# 1) Place a LIMIT order that rests away from the market.
placed = client.placeorder(
    strategy="Chapter25", symbol="SBIN", exchange="NSE", action="BUY",
    price_type="LIMIT", product="CNC", quantity=1, price=700,
)
order_id = placed["orderid"]
print(f"Placed  : {order_id} at 700")

# 2) Modify it: raise the limit price to 710. Re-send the order's details.
modified = client.modifyorder(
    order_id=order_id, strategy="Chapter25", symbol="SBIN", exchange="NSE",
    action="BUY", price_type="LIMIT", product="CNC", quantity=1, price=710,
)
print(f"Modified: {modified['status']} -> new price 710")

# 3) Changed your mind? Cancel it by id.
cancelled = client.cancelorder(order_id=order_id, strategy="Chapter25")
print(f"Cancelled: {cancelled['status']}")
