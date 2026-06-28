# Test 1000 PURELY RANDOM strategies on real Nifty. Watch the luckiest one look brilliant.
import os
from datetime import datetime

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2021-01-01", end_date=end)["close"].pct_change().dropna().values

rng = np.random.default_rng(0)
N, days = 1000, len(r)
sharpes = np.empty(N)
for i in range(N):
    signal = rng.choice([1, -1], size=days)        # random long/short each day - pure noise
    strat = signal * r
    sharpes[i] = strat.mean() / strat.std() * np.sqrt(252)

print(f"Tested {N} purely RANDOM strategies on {days} days of Nifty.")
print(f"Mean Sharpe (should be ~0): {sharpes.mean():+.2f}")
print(f"Best  random Sharpe       : {sharpes.max():+.2f}")
print(f"Worst random Sharpe       : {sharpes.min():+.2f}")
print(f"\nThe 'best' strategy has a Sharpe of {sharpes.max():.2f} - and it is PURE LUCK. None has any edge.")
