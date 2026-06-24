# A complete live trade manager: a fixed target plus a trailing stop, in one class.
import os
import time

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
    ws_url=os.getenv("OPENALGO_WS_URL", "ws://127.0.0.1:8765"),
)


class TradeManager:
    def __init__(self, entry, trail, target):
        self.entry = entry
        self.trail = trail
        self.target = entry + target
        self.high_water = entry
        self.stop = entry - trail
        self.open = True

    def on_tick(self, message):
        if not self.open:
            return
        ltp = float(message["data"]["ltp"])
        if ltp > self.high_water:               # trail the stop upward only
            self.high_water = ltp
            self.stop = max(self.stop, ltp - self.trail)
        if ltp >= self.target:
            self.close(ltp, "TARGET")
        elif ltp <= self.stop:
            self.close(ltp, "TRAILING STOP")
        else:
            print(f"LTP {ltp:.2f}  stop {self.stop:.2f}  tgt {self.target:.2f}", end="\r")

    def close(self, ltp, reason):
        print(f"\n{reason} hit at {ltp:.2f} - closing the position")
        self.open = False


mgr = TradeManager(entry=6000.0, trail=25.0, target=60.0)
inst = [{"exchange": "MCX", "symbol": "CRUDEOIL20JUL26FUT"}]

client.connect()
client.subscribe_ltp(inst, on_data_received=mgr.on_tick)
while mgr.open:
    time.sleep(0.2)
client.unsubscribe_ltp(inst)
client.disconnect()
