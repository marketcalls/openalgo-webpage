# Watch a live position and exit the moment price hits the stop-loss or target.
import os
import time

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
    ws_url=os.getenv("OPENALGO_WS_URL", "ws://127.0.0.1:8765"),
)

SYMBOL, EXCHANGE = "CRUDEOIL20JUL26FUT", "MCX"
entry = 6000.0           # the price you bought at (from your fill - see Chapter 25)
stop_loss = entry - 30   # cap the loss 30 points below entry
target = entry + 60      # take profit 60 points above (a 1:2 risk-reward)
position_open = True


def on_ltp(message):
    global position_open
    if not position_open:
        return
    ltp = float(message["data"]["ltp"])
    if ltp <= stop_loss:
        print(f"\nSTOP-LOSS hit at {ltp:.2f} - exit for a small, planned loss")
        position_open = False
    elif ltp >= target:
        print(f"\nTARGET hit at {ltp:.2f} - exit in profit")
        position_open = False
    else:
        print(f"holding  LTP {ltp:.2f}  SL {stop_loss:.2f}  TGT {target:.2f}", end="\r")


client.connect()
client.subscribe_ltp([{"exchange": EXCHANGE, "symbol": SYMBOL}], on_data_received=on_ltp)

while position_open:      # the feed, not a polling loop, drives the exit
    time.sleep(0.2)

client.unsubscribe_ltp([{"exchange": EXCHANGE, "symbol": SYMBOL}])
client.disconnect()
