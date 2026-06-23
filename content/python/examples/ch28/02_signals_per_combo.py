# Turn one (fast, slow) combo into entry/exit signals -- the unit we repeat.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=500)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
close = df["close"]

fast, slow = 10, 50
fast_ema = ta.ema(close, fast)
slow_ema = ta.ema(close, slow)

# Enter when the fast EMA crosses ABOVE the slow; exit when it crosses below.
entries = (fast_ema > slow_ema) & (fast_ema.shift(1) <= slow_ema.shift(1))
exits = (fast_ema < slow_ema) & (fast_ema.shift(1) >= slow_ema.shift(1))

print(f"EMA {fast} / {slow} on RELIANCE, {len(close)} daily bars")
print(f"Entry signals: {int(entries.sum())}")
print(f"Exit signals : {int(exits.sum())}")
print("\nWe will run this exact recipe for every combo in the grid.")
