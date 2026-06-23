# Understand analyze mode vs live mode before sending any order.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

status = client.analyzerstatus()["data"]
print("analyze_mode:", status["analyze_mode"])

if status["analyze_mode"]:
    print("SAFE: orders are simulated, nothing reaches the exchange.")
else:
    print("LIVE: real orders would be sent. Practise in analyze mode first.")
# To switch on simulation from code:  client.analyzertoggle(mode=True)
