# A split order chops one big order into smaller child orders automatically.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Buy 5 lots of GOLDM but in chunks of 2 -> orders of 2, 2, 1. Useful for large
# F&O orders that exceed the exchange freeze limit, or to reduce market impact.
response = client.splitorder(
    symbol="GOLDM03JUL26FUT",
    exchange="MCX",
    action="BUY",
    quantity=5,
    splitsize=2,
    price_type="MARKET",
    product="NRML",
)

print(f"Status: {response['status']}  total {response['total_quantity']} in chunks of {response['split_size']}")
for leg in response["results"]:
    print(f"  order {leg['order_num']}: qty {leg['quantity']}  id {leg['orderid']}")
