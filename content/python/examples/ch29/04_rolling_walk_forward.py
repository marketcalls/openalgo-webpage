# Roll the window forward: tune, test, slide, repeat -- mimicking real re-tuning.
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


def signals(c, f, s):
    fe, se = ta.ema(c, f), ta.ema(c, s)
    return ((fe > se) & (fe.shift(1) <= se.shift(1)),
            (fe < se) & (fe.shift(1) >= se.shift(1)))


def best_on(c):
    ent = {cb: signals(c, *cb)[0] for cb in COMBOS}
    ext = {cb: signals(c, *cb)[1] for cb in COMBOS}
    cols = pd.MultiIndex.from_tuples(COMBOS, names=["fast", "slow"])
    pf = vbt.Portfolio.from_signals(c, pd.DataFrame(ent).set_axis(cols, axis=1),
                                    pd.DataFrame(ext).set_axis(cols, axis=1),
                                    init_cash=100000, fees=0.001, freq="1D")
    return tuple(int(x) for x in pf.sharpe_ratio().idxmax())


end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]

train_len, test_len = 250, 100                        # window sizes in bars
print(f"{'window':7}{'tuned EMA':12}{'OOS return %':>13}")
i = 0
while i + train_len + test_len <= len(close):
    tr = close.iloc[i:i + train_len]
    te = close.iloc[i + train_len:i + train_len + test_len]
    f, s = best_on(tr)                                # tune on train window
    e, x = signals(te, f, s)
    oos = vbt.Portfolio.from_signals(te, e, x, init_cash=100000, fees=0.001,
                                     freq="1D").total_return() * 100
    print(f"{i // test_len + 1:<7}{f'{f}/{s}':12}{oos:13.2f}")  # test on next window
    i += test_len                                     # slide forward
