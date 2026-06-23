# Broadcast every combo into 2D signals and backtest them all in ONE VectorBT call.
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
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
close = df["close"]

combos = [(f, s) for f in (5, 10, 15, 20) for s in (30, 40, 50, 60) if f < s]
ent, ext = {}, {}
for f, s in combos:                                   # one column per combo
    fe, se = ta.ema(close, f), ta.ema(close, s)
    ent[(f, s)] = (fe > se) & (fe.shift(1) <= se.shift(1))
    ext[(f, s)] = (fe < se) & (fe.shift(1) >= se.shift(1))

cols = pd.MultiIndex.from_tuples(combos, names=["fast", "slow"])
entries = pd.DataFrame(ent).set_axis(cols, axis=1)    # 2D: rows=dates, cols=combos
exits = pd.DataFrame(ext).set_axis(cols, axis=1)

pf = vbt.Portfolio.from_signals(close, entries, exits, init_cash=100000, fees=0.001, freq="1D")
ret = pf.total_return().sort_values(ascending=False)  # one return per combo
print(f"Tested {len(combos)} combos in a single backtest.\n")
print("Best 3 combos by total return:")
print((ret.head(3) * 100).round(2).astype(str) + " %")
