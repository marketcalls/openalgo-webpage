# The single best combo is often LUCK. A robust region beats a lonely peak.
import os
from datetime import datetime, timedelta

import pandas as pd
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=500)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]

combos = [(f, s) for f in (5, 10, 15, 20) for s in (30, 40, 50, 60) if f < s]
ent, ext = {}, {}
for f, s in combos:
    fe, se = ta.ema(close, f), ta.ema(close, s)
    ent[(f, s)] = (fe > se) & (fe.shift(1) <= se.shift(1))
    ext[(f, s)] = (fe < se) & (fe.shift(1) >= se.shift(1))
cols = pd.MultiIndex.from_tuples(combos, names=["fast", "slow"])
pf = vbt.Portfolio.from_signals(close, pd.DataFrame(ent).set_axis(cols, axis=1),
                                pd.DataFrame(ext).set_axis(cols, axis=1),
                                init_cash=100000, fees=0.001, freq="1D")

grid = pf.sharpe_ratio().unstack("slow")
peak = pf.sharpe_ratio().idxmax()
# A combo is only trustworthy if its NEIGHBOURS also score well. We grade each
# combo by the average Sharpe of its local block (itself plus adjacent cells).
smoothed = grid.rolling(2, min_periods=1).mean().T.rolling(2, min_periods=1).mean().T
robust = smoothed.stack().idxmax()

print(f"Lonely peak (best single combo) : EMA {peak[0]}/{peak[1]}")
print(f"Robust pick (best neighbourhood): EMA {robust[0]}/{robust[1]}")
print("\nPrefer a setting surrounded by other good settings: if next year the")
print("ideal lengths drift a little, you are still standing on solid ground.")
