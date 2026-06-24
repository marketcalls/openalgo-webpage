# A trailing stop follows price up to lock in profit - it never moves back down.
import os
import time

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
    ws_url=os.getenv("OPENALGO_WS_URL", "ws://127.0.0.1:8765"),
)

SYMBOL, EXCHANGE = "CRUDEOIL20JUL26FUT", "MCX"
TRAIL = 25.0             # keep the stop 25 points under the best price seen
entry = 6000.0
high_water = entry       # highest price reached since entry
stop_loss = entry - TRAIL
position_open = True


def on_ltp(message):
    global high_water, stop_loss, position_open
    if not position_open:
        return
    ltp = float(message["data"]["ltp"])
    if ltp > high_water:             # new high -> drag the stop up behind it
        high_water = ltp
        stop_loss = high_water - TRAIL
    if ltp <= stop_loss:             # price slipped back to the trailing stop
        print(f"\nTRAILING STOP hit at {ltp:.2f}  (stop had locked to {stop_loss:.2f})")
        position_open = False
    else:
        print(f"LTP {ltp:.2f}  peak {high_water:.2f}  stop {stop_loss:.2f}", end="\r")


client.connect()
client.subscribe_ltp([{"exchange": EXCHANGE, "symbol": SYMBOL}], on_data_received=on_ltp)

while position_open:
    time.sleep(0.2)

client.unsubscribe_ltp([{"exchange": EXCHANGE, "symbol": SYMBOL}])
client.disconnect()
