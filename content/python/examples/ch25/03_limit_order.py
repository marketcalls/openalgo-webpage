# A LIMIT order: buy SBIN only if the price reaches your chosen level or better.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# A LIMIT order needs a price. We bid below the market so it rests as a pending
# order instead of filling instantly. trigger_price is 0 (not a stop order).
response = client.placeorder(
    strategy="Chapter25",
    symbol="SBIN",
    exchange="NSE",
    action="BUY",
    price_type="LIMIT",
    product="CNC",
    quantity=1,
    price=700,
    trigger_price=0,
)

print(f"Status : {response['status']}")
print(f"Order id: {response.get('orderid')}  (resting at 700)")
