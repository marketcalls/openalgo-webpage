# Point-in-time features + triple-barrier labels on a real stock, with the label distribution.
import os
from datetime import datetime

import numpy as np
import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date="2021-01-01", end_date=end)
c, h, l = df["close"], df["high"], df["low"]
ret = c.pct_change()

# Point-in-time features: each value is known at that bar's close, never uses the future.
feat = pd.DataFrame(index=df.index)
feat["ret1"] = ret                                  # today's realised return
feat["vol20"] = ta.stdev(ret.fillna(0.0), 20)       # rolling daily volatility (stationary)
feat["rsi14"] = ta.rsi(c, 14)                        # momentum oscillator

# Triple-barrier labelling: barriers scaled by each event's own volatility.
PT, SL, H = 2.0, 2.0, 10                             # profit-take, stop (x daily vol), horizon bars
cv, hv, lv, vv = c.values, h.values, l.values, feat["vol20"].values
labels = np.full(len(c), np.nan)
for i in range(len(c)):
    vol = vv[i]
    if np.isnan(vol) or vol == 0.0 or i + H >= len(c):
        continue
    up, dn = cv[i] * (1 + PT * vol), cv[i] * (1 - SL * vol)
    out = 0                                          # time barrier unless a level is touched
    for j in range(i + 1, i + H + 1):
        if hv[j] >= up:
            out = 1; break                           # profit-take hit first
        if lv[j] <= dn:
            out = -1; break                          # stop hit first
    labels[i] = out

lab = pd.Series(labels, index=df.index, name="label").dropna()
names = {1: "profit-take (+1)", -1: "stop (-1)", 0: "time barrier (0)"}
dist = lab.value_counts()
total = len(lab)

print(f"RELIANCE NSE daily  events={total}  PT={PT}xvol  SL={SL}xvol  horizon={H} bars")
for k in (1, -1, 0):
    n = int(dist.get(k, 0))
    print(f"  {names[k]:<18}: {n:4d}  ({100*n/total:4.1f}%)")
print(f"  features used      : {', '.join(feat.columns)}")
up_share = 100 * int(dist.get(1, 0)) / total
print(f"SUMMARY: {total} vol-scaled events, {up_share:.1f}% resolved at the profit-take barrier first.")
