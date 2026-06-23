# Step 2: take the winner from training and grade it on UNSEEN out-of-sample data.
import os
from datetime import datetime, timedelta

import pandas as pd
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def run(c, f, s):                                     # backtest one combo on a slice
    fe, se = ta.ema(c, f), ta.ema(c, s)
    e = (fe > se) & (fe.shift(1) <= se.shift(1))
    x = (fe < se) & (fe.shift(1) >= se.shift(1))
    return vbt.Portfolio.from_signals(c, e, x, init_cash=100000, fees=0.001, freq="1D")


def best_on(c, combos):                               # pick best Sharpe combo on a slice
    ent = {cb: ((ta.ema(c, cb[0]) > ta.ema(c, cb[1])) &
                (ta.ema(c, cb[0]).shift(1) <= ta.ema(c, cb[1]).shift(1))) for cb in combos}
    ext = {cb: ((ta.ema(c, cb[0]) < ta.ema(c, cb[1])) &
                (ta.ema(c, cb[0]).shift(1) >= ta.ema(c, cb[1]).shift(1))) for cb in combos}
    cols = pd.MultiIndex.from_tuples(combos, names=["fast", "slow"])
    pf = vbt.Portfolio.from_signals(c, pd.DataFrame(ent).set_axis(cols, axis=1),
                                    pd.DataFrame(ext).set_axis(cols, axis=1),
                                    init_cash=100000, fees=0.001, freq="1D")
    return tuple(int(x) for x in pf.sharpe_ratio().idxmax())


end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]
cut = int(len(close) * 0.7)
combos = [(f, s) for f in (10, 20, 30) for s in (40, 50, 60) if f < s]

best = best_on(close.iloc[:cut], combos)              # learn on train
in_s = run(close.iloc[:cut], *best).total_return() * 100
out_s = run(close.iloc[cut:], *best).total_return() * 100
print(f"Chosen on training: EMA {best[0]}/{best[1]}")
print(f"In-sample return  : {in_s:6.2f} %  (what we tuned for)")
print(f"Out-of-sample     : {out_s:6.2f} %  (the only number that counts)")
