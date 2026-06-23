# A basket order fires several different orders in one call (a long/short pair).
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Each basket leg is its own dictionary, and basket legs use the key "pricetype"
# (no underscore) -- unlike placeorder and splitorder, which use price_type=.
orders = [
    {"symbol": "RELIANCE", "exchange": "NSE", "action": "BUY",
     "quantity": 1, "pricetype": "MARKET", "product": "CNC"},
    {"symbol": "INFY", "exchange": "NSE", "action": "SELL",
     "quantity": 1, "pricetype": "MARKET", "product": "CNC"},
]

response = client.basketorder(orders=orders)

print(f"Basket status: {response['status']}")
for leg in response["results"]:
    print(f"  {leg['symbol']:10s} -> {leg['status']}  id {leg['orderid']}")
