# Parameter STABILITY: does the optimiser pick the same settings each window?
import os
from datetime import datetime, timedelta

import pandas as pd
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

COMBOS = [(f, s) for f in (10, 20, 30) for s in (40, 50, 60) if f < s]


def best_on(c):
    ent, ext = {}, {}
    for f, s in COMBOS:
        fe, se = ta.ema(c, f), ta.ema(c, s)
        ent[(f, s)] = (fe > se) & (fe.shift(1) <= se.shift(1))
        ext[(f, s)] = (fe < se) & (fe.shift(1) >= se.shift(1))
    cols = pd.MultiIndex.from_tuples(COMBOS, names=["fast", "slow"])
    pf = vbt.Portfolio.from_signals(c, pd.DataFrame(ent).set_axis(cols, axis=1),
                                    pd.DataFrame(ext).set_axis(cols, axis=1),
                                    init_cash=100000, fees=0.001, freq="1D")
    return tuple(int(x) for x in pf.sharpe_ratio().idxmax())


end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]

picks = []
train_len, step = 250, 100
i = 0
while i + train_len <= len(close):
    picks.append(best_on(close.iloc[i:i + train_len]))
    i += step

print("Best combo chosen in each rolling training window:")
for n, (f, s) in enumerate(picks, 1):
    print(f"  window {n}: EMA {f}/{s}")
unique = len(set(picks))
print(f"\nDistinct picks across {len(picks)} windows: {unique}")
print("Few distinct picks -> STABLE and trustworthy. Jumping around -> noise-fitting.")
