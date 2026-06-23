# Same sweep, a different market: gold futures on MCX. Edges are asset-specific.
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
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")
# GOLDM = mini gold contract on MCX. Commodities trend differently from equities.
close = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D",
                       start_date=start, end_date=end)["close"]

combos = [(f, s) for f in (5, 10, 20) for s in (30, 50) if f < s]
ent, ext = {}, {}
for f, s in combos:
    fe, se = ta.ema(close, f), ta.ema(close, s)
    ent[(f, s)] = (fe > se) & (fe.shift(1) <= se.shift(1))
    ext[(f, s)] = (fe < se) & (fe.shift(1) >= se.shift(1))
cols = pd.MultiIndex.from_tuples(combos, names=["fast", "slow"])
pf = vbt.Portfolio.from_signals(close, pd.DataFrame(ent).set_axis(cols, axis=1),
                                pd.DataFrame(ext).set_axis(cols, axis=1),
                                init_cash=200000, fees=0.0008, freq="1D")

table = pd.DataFrame({"return_%": (pf.total_return() * 100).round(2),
                      "sharpe": pf.sharpe_ratio().round(2)}).sort_values("sharpe", ascending=False)
print(f"GOLDM gold futures, {len(close)} daily bars on MCX\n")
print(table)
print("\nNote how the best settings here need not match RELIANCE -- never assume")
print("one parameter set is universal. Re-optimise per instrument.")
