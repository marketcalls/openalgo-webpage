# The two "panic buttons": cancel every pending order and flatten every position.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# cancelallorder() removes every open/pending order in one shot.
cancelled = client.cancelallorder(strategy="Chapter25")
print(f"Cancel all : {cancelled['status']} - {cancelled.get('message')}")

# closeposition() squares off every open position with market orders
# (a SELL for longs, a BUY for shorts). Your end-of-day flatten button.
closed = client.closeposition(strategy="Chapter25")
print(f"Close all  : {closed['status']} - {closed.get('message')}")

print("Use these for an emergency exit or a clean end-of-day square-off.")
