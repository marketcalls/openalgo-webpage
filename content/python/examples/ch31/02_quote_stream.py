# Quote mode streams the full snapshot - price, volume and the day's range.
import os
import time

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
    ws_url=os.getenv("OPENALGO_WS_URL", "ws://127.0.0.1:8765"),
)

instruments = [{"exchange": "NSE", "symbol": "SBIN"}]


def on_quote(message):
    q = message["data"]
    change = q["ltp"] - q["close"]          # close here is yesterday's close
    print(
        f"{q['symbol']}  LTP {q['ltp']:.2f}  "
        f"({change:+.2f})  vol {q['volume']}  "
        f"range {q['low']:.2f}-{q['high']:.2f}"
    )


client.connect()
client.subscribe_quote(instruments, on_data_received=on_quote)

time.sleep(10)

client.unsubscribe_quote(instruments)
client.disconnect()
