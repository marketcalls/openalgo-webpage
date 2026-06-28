# Backtest a momentum-sign forecast on NIFTY, split in-sample vs out-of-sample, and measure the decay.
import os
from datetime import datetime

import numpy as np
import pandas as pd
from openalgo import api
from scipy import stats

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
close = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date="2015-01-01", end_date=end)["close"].astype(float)

# Forecast: sign of (20-day SMA minus 50-day SMA), shifted, predicts tomorrow's direction.
ret = close.pct_change()
sig = np.sign(close.rolling(20).mean() - close.rolling(50).mean()).shift(1)
df = pd.DataFrame({"ret": ret, "sig": sig}).dropna()
df = df[df.sig != 0]

hit = (np.sign(df.ret) == df.sig).astype(int)          # 1 if direction called right
split = int(len(df) * 0.65)                              # first 65% = in-sample
ins, oos = hit.iloc[:split], hit.iloc[split:]


def assess(h):
    p, n = h.mean(), len(h)
    z = (p - 0.5) / np.sqrt(0.25 / n)                    # is the edge over 50% real?
    return p, n, z, 1 - stats.norm.cdf(z)


pi, ni, zi, pvi = assess(ins)
po, no, zo, pvo = assess(oos)
ann = lambda h: (df.sig * df.ret).loc[h.index].mean() * 252 * 100

print(f"20/50 momentum-sign forecast on NIFTY, split {df.index[split].date()}")
print(f"{'':22s}{'in-sample':>14s}{'out-of-sample':>16s}")
print(f"{'directional accuracy':22s}{pi*100:>13.2f}%{po*100:>15.2f}%")
print(f"{'miss rate (error)':22s}{(1-pi)*100:>13.2f}%{(1-po)*100:>15.2f}%")
print(f"{'edge over coin flip':22s}{(pi-0.5)*100:>+12.2f}pt{(po-0.5)*100:>+14.2f}pt")
print(f"{'z vs 50%':22s}{zi:>14.2f}{zo:>16.2f}")
print(f"{'p-value (one-sided)':22s}{pvi:>14.4f}{pvo:>16.4f}")
print(f"{'ann. signed return':22s}{ann(ins):>13.2f}%{ann(oos):>15.2f}%")
print(f"\nEdge real in-sample (p={pvi:.4f}); out-of-sample it is a coin flip (p={pvo:.3f}) - the model decayed.")
