# placesmartorder() drives your position to a TARGET size, not a fixed quantity.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# position_size is the absolute target holding you want to end up with.
# OpenAlgo checks your current position and only sends the difference.
# Here: target 5 long. If you hold 0, it buys 5; if you hold 3, it buys 2.
response = client.placesmartorder(
    strategy="Chapter25",
    symbol="RELIANCE",
    exchange="NSE",
    action="BUY",
    price_type="MARKET",
    product="CNC",
    quantity=1,
    position_size=5,
)

print(f"Status  : {response['status']}")
print(f"Order id: {response.get('orderid')}")
print("Smart orders keep you AT a target size instead of adding blindly.")
