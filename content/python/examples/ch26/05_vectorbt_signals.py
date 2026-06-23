# VectorBT wants discrete ENTRY and EXIT events, not a held-position column.
import datetime
import os

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="SBIN", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)

# entry = the day fast CROSSES ABOVE slow; exit = the day it crosses back below.
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))

print(f"Entry signals (crossovers) : {int(entries.sum())}")
print(f"Exit signals (crossunders) : {int(exits.sum())}")
print("VectorBT holds the position between an entry and the next exit for you.")
