# Read the order book: every order you sent today and a summary of their states.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

book = client.orderbook()
data = book["data"]
orders = data["orders"]
stats = data["statistics"]

print(f"Orders today: {len(orders)}")
print(f"  completed: {stats['total_completed_orders']:.0f}  "
      f"open: {stats['total_open_orders']:.0f}  "
      f"rejected: {stats['total_rejected_orders']:.0f}")

# Show the five most recent orders.
for o in orders[:5]:
    print(f"  {o['action']:4s} {o['symbol']:16s} {o['pricetype']:7s} "
          f"qty {o['quantity']} -> {o['order_status']}")
