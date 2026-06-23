# Step 1 of walk-forward: find the best parameter ON THE TRAINING DATA ONLY.
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
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]
train = close.iloc[:int(len(close) * 0.7)]            # tune only on this slice

combos = [(f, s) for f in (10, 20, 30) for s in (40, 50, 60) if f < s]
ent, ext = {}, {}
for f, s in combos:
    fe, se = ta.ema(train, f), ta.ema(train, s)
    ent[(f, s)] = (fe > se) & (fe.shift(1) <= se.shift(1))
    ext[(f, s)] = (fe < se) & (fe.shift(1) >= se.shift(1))
cols = pd.MultiIndex.from_tuples(combos, names=["fast", "slow"])
pf = vbt.Portfolio.from_signals(train, pd.DataFrame(ent).set_axis(cols, axis=1),
                                pd.DataFrame(ext).set_axis(cols, axis=1),
                                init_cash=100000, fees=0.001, freq="1D")

best = tuple(int(x) for x in pf.sharpe_ratio().idxmax())
print(f"Tuned on {len(train)} in-sample bars.")
print(f"Best combo by Sharpe: EMA {best[0]}/{best[1]}")
print(f"In-sample Sharpe    : {pf.sharpe_ratio()[best]:.2f}  (looks great -- but it SHOULD)")
