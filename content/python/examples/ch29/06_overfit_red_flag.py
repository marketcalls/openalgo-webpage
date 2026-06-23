# The overfitting tell: a big gap between in-sample glory and out-of-sample reality.
import os
from datetime import datetime, timedelta

import pandas as pd
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

COMBOS = [(f, s) for f in (5, 10, 20) for s in (30, 50) if f < s]


def run(c, f, s):
    fe, se = ta.ema(c, f), ta.ema(c, s)
    e = (fe > se) & (fe.shift(1) <= se.shift(1))
    x = (fe < se) & (fe.shift(1) >= se.shift(1))
    return vbt.Portfolio.from_signals(c, e, x, init_cash=100000, fees=0.001, freq="1D")


end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]
cut = int(len(close) * 0.6)
train, test = close.iloc[:cut], close.iloc[cut:]

print(f"{'EMA':9}{'in-sample %':>13}{'out-sample %':>14}{'  gap':>8}")
for f, s in COMBOS:
    ins = run(train, f, s).total_return() * 100
    oos = run(test, f, s).total_return() * 100
    print(f"{f'{f}/{s}':9}{ins:13.2f}{oos:14.2f}{ins - oos:8.1f}")
print("\nA combo that shines in-sample but collapses out-of-sample is OVERFIT.")
print("Trust the setting whose two columns stay closest together.")
