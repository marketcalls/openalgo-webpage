# The algo loop on real 1m bars: data -> signal -> sizing -> order intent -> risk. No orders sent.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# --- DATA: recent 1m bars for one liquid name ---
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="1m",
                    start_date=start, end_date=end)
close = df["close"].values
stamps = df.index

# --- SIGNAL: 9/21 EMA crossover, computed once, vectorised ---
fast = np.asarray(ta.ema(df["close"], 9))
slow = np.asarray(ta.ema(df["close"], 21))
up = ta.crossover(fast, slow)     # fast crosses above slow -> go long
dn = ta.crossunder(fast, slow)    # fast crosses below slow -> go flat

BUDGET, MAX_QTY = 100_000, 60     # sizing budget and a hard position cap (risk)
position, held, n_signals, blocked = 0, 0, 0, 0
print("time      price    fast    slow  signal  ->  intent       qty")

# --- LOOP: walk the most recent bars as if they arrived one by one ---
for i in range(len(close) - 90, len(close)):
    if not (up[i] or dn[i]):
        continue
    target = 1 if up[i] else 0                 # desired state from the signal
    if target == position:                     # IDEMPOTENCY: already there, skip
        continue
    price = close[i]
    if target == 1:                            # SIZING on entry
        want = int(BUDGET // price)
        qty = min(want, MAX_QTY)               # RISK gate: clip to position cap
        blocked += qty < want
        intent, held = "BUY (enter)", qty
    else:                                       # exit flattens whatever we hold
        qty, intent, held = held, "SELL (exit)", 0
    print(f"{stamps[i]:%H:%M}  {price:7.1f}  {fast[i]:6.1f}  {slow[i]:6.1f}    "
          f"{'up' if up[i] else 'dn'}   ->  {intent:11s} {qty:3d}")
    position, n_signals = target, n_signals + 1

print(f"\n{n_signals} signals in the last 90 bars; {blocked} risk-capped; final state: "
      f"{'LONG' if position else 'FLAT'}. (sandbox-safe, no orders placed)")
