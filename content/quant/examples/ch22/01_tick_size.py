# Every instrument moves in fixed steps - the tick size. Let's look a few up.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

instruments = [
    ("RELIANCE", "NSE"),
    ("MRF", "NSE"),                    # India's priciest share - same tick as a cheap one
    ("NIFTY", "NSE_INDEX"),
    ("CRUDEOIL20JUL26FUT", "MCX"),
]

print(f"{'INSTRUMENT':24s}{'TICK':>8s}{'LOT':>8s}  TYPE")
for sym, exch in instruments:
    d = client.symbol(symbol=sym, exchange=exch)["data"]
    print(f"{sym:24s}{d['tick_size']:>8}{d['lotsize']:>8}  {d['instrumenttype']}")

print("\nThe tick is the smallest legal price step - the grid every quote must land on.")
