# A MARKET order: buy 1 RELIANCE for delivery (CNC) at the best available price.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# price_type=MARKET means "fill me now at whatever the market is".
# product=CNC means delivery (you intend to hold the shares).
response = client.placeorder(
    strategy="Chapter25",
    symbol="RELIANCE",
    exchange="NSE",
    action="BUY",
    price_type="MARKET",
    product="CNC",
    quantity=1,
)

print(response)
print(f"Status : {response['status']}")
print(f"Order id: {response.get('orderid')}")
