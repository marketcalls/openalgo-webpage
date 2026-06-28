# Watch a FIFO bid queue drain: your position falls as sells fill and orders ahead cancel.
import os
from datetime import date, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SYMBOL, EXCHANGE = "CRUDEOIL20JUL26FUT", "MCX"
YOUR_LOTS = 5         # your passive BUY, resting at the back of the best-bid queue
SELL_SHARE = 0.5      # share of flow that arrives as sells hitting the bid
CANCEL_MULT = 1.2     # cancels-ahead per sell (real books cancel more than they trade)
DEPTH_MINUTES = 2     # illustrative depth ahead of you = this many minutes of real flow

# Real per-minute flow from the last trading day drives the event rates.
end = date(2026, 6, 26)
start = end - timedelta(days=10)
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="1m",
                    start_date=start.isoformat(), end_date=end.isoformat())
flow = float(df["volume"].median())               # real lots/min

rng = np.random.default_rng(7)
ahead0 = round(DEPTH_MINUTES * flow)              # lots in front of you when you join
sell_ps = flow * SELL_SHARE / 60.0               # sells per second hitting the bid
cancel_ps = sell_ps * CANCEL_MULT                # cancels-ahead per second (scaled by queue left)

t, ahead, yours = 0, ahead0, YOUR_LOTS
times, ahead_path = [0], [ahead0]
front_t = fill_t = None
while yours > 0 and t < 1800:                     # cap the sim at 30 minutes
    t += 1
    cancels = rng.poisson(cancel_ps * (ahead / ahead0)) if ahead > 0 else 0
    ahead = max(0, ahead - cancels)              # cancels ahead advance you but never fill you
    sells = rng.poisson(sell_ps)
    eat = min(ahead, sells)                       # sells first clear the queue ahead...
    ahead -= eat
    sells -= eat
    if ahead == 0 and front_t is None:
        front_t = t
    if ahead == 0 and sells > 0:                  # ...then fill your lots, FIFO
        yours = max(0, yours - sells)
        if yours == 0 and fill_t is None:
            fill_t = t
    times.append(t)
    ahead_path.append(ahead)

mins = np.array(times) / 60.0
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(mins, ahead_path, color="#7c83ff", linewidth=2, label="lots ahead of you")
ax.axhline(0, color="#9a9a9a", linewidth=1)
if front_t:
    ax.axvline(front_t / 60.0, color="#16a34a", linestyle="--", linewidth=1.4,
               label=f"reached front ({front_t / 60.0:.1f} min)")
if fill_t:
    ax.axvline(fill_t / 60.0, color="#dc2626", linestyle="--", linewidth=1.4,
               label=f"fully filled ({fill_t / 60.0:.1f} min)")
ax.set_title(f"{SYMBOL} - your position in the FIFO bid queue draining")
ax.set_xlabel("Minutes after you joined the back of the queue")
ax.set_ylabel("Lots resting ahead of you")
ax.legend(loc="upper right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

filled = "did not fully fill" if fill_t is None else f"fully filled in {fill_t / 60.0:.1f} min"
print(f"SUMMARY {SYMBOL}: joined behind {ahead0} lots, reached the front in "
      f"{(front_t or 0) / 60.0:.1f} min and {filled} (real flow {flow:.0f} lots/min). Saved {out.name}")
