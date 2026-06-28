# Look-ahead bias: scoring a momentum signal on the SAME bar inflates its hit rate.
import os
from datetime import datetime

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
c = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2018-01-01", end_date=end)["close"]
r = c.pct_change()

# A 10-day momentum signal: long if today is above its level 10 sessions ago.
signal = np.sign(c - c.shift(10))


def hit_and_mean(pnl):
    pnl = pnl.dropna()
    hit = (pnl > 0).mean() * 100
    return hit, pnl.mean() * 1e4   # average return in basis points per day


# Leaked: today's close is in the signal AND in the return it is scored against.
leak_hit, leak_bp = hit_and_mean(signal * r)
# Honest: yesterday's signal decides, the position then earns today's return.
true_hit, true_bp = hit_and_mean(signal.shift(1) * r)

print(f"Leaked  (scored on same bar) : hit rate {leak_hit:5.1f}%   avg {leak_bp:+6.1f} bp/day   <- fantasy")
print(f"Honest  (prior bars only)    : hit rate {true_hit:5.1f}%   avg {true_bp:+6.1f} bp/day   <- reality")
print(f"\nOne .shift(1) erased {leak_hit - true_hit:.1f} points of hit rate. The 'edge' was the leak.")
