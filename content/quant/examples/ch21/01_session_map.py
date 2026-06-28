# Map a real trading day to its sessions: first and last prints of NIFTY 1m bars.
import os

import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Pull a window of 1m bars and use the most recent trading day present.
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="1m",
                    start_date="2026-06-18", end_date="2026-06-28").sort_index()
last_day = df.index.normalize().max()
day = df[df.index.normalize() == last_day]

first, last = day.iloc[0], day.iloc[-1]
open_print, close_print = first["open"], last["close"]

print(f"NIFTY trading day {last_day.date()}   ({len(day)} one-minute bars)\n")
print(f"First bar  {first.name.time()}  -> continuous session opens; this opening print")
print(f"           comes out of the 09:00-09:15 pre-open call auction")
print(f"Opening print : {open_print:,.2f}")
print(f"Last bar   {last.name.time()}  -> last continuous minute before the 15:30 bell")
print(f"Closing print : {close_print:,.2f}")
print(f"\nDay open {first['open']:,.2f}  high {day['high'].max():,.2f}  "
      f"low {day['low'].min():,.2f}  close {close_print:,.2f}")

print("\nThe Indian equity day, mapped:")
for win, label in [("09:00-09:15", "pre-open call auction (order collection + price discovery)"),
                   ("09:15-15:30", "continuous trading (price-time matching)"),
                   ("15:30-15:40", "buffer before the closing session"),
                   ("15:40-16:00", "post-close / closing-price session")]:
    print(f"  {win}  {label}")
