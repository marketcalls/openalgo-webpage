# Your first live stream: open one connection and let prices come to you.
import os
import time

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
    ws_url=os.getenv("OPENALGO_WS_URL", "ws://127.0.0.1:8765"),
)

instruments = [
    {"exchange": "NSE", "symbol": "RELIANCE"},
    {"exchange": "NSE", "symbol": "INFY"},
]


# This callback fires every time the exchange pushes a fresh tick.
def on_ltp(message):
    tick = message["data"]
    print(f"{tick['symbol']:10s} LTP: {tick['ltp']}")


client.connect()                       # open the persistent connection once
client.subscribe_ltp(instruments, on_data_received=on_ltp)

time.sleep(10)                         # let ticks stream in for ten seconds

client.unsubscribe_ltp(instruments)
client.disconnect()                    # always close the line when you are done
