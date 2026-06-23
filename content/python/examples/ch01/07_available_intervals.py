# Ask the server which candle intervals your broker supports.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

intervals = client.intervals()["data"]
print("Minutes:", intervals["minutes"])
print("Hours  :", intervals["hours"])
print("Daily  :", intervals["days"])
