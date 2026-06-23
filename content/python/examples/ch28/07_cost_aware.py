# Costs change the winner. Optimise WITH realistic fees, never on a frictionless dream.
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
entries = pd.DataFrame(ent).set_axis(cols, axis=1)
exits = pd.DataFrame(ext).set_axis(cols, axis=1)

# Same signals, two cost assumptions. fees=0.0015 ~ 0.15% per trade (brokerage + taxes).
free = vbt.Portfolio.from_signals(close, entries, exits, init_cash=100000, fees=0.0, freq="1D")
real = vbt.Portfolio.from_signals(close, entries, exits, init_cash=100000,
                                  fees=0.0015, slippage=0.0005, freq="1D")

best_free = tuple(int(x) for x in free.total_return().idxmax())
best_real = tuple(int(x) for x in real.total_return().idxmax())
print(f"Best combo with NO costs  : EMA {best_free[0]}/{best_free[1]}")
print(f"Best combo WITH costs     : EMA {best_real[0]}/{best_real[1]}")
fast_combo = (5, 30)
print(f"\nFor the trade-heavy EMA {fast_combo[0]}/{fast_combo[1]}:")
print(f"  return no-cost : {free.total_return()[fast_combo] * 100:6.2f} %")
print(f"  return costed  : {real.total_return()[fast_combo] * 100:6.2f} %  <- fees punish churn")
