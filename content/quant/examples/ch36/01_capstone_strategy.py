# CAPSTONE: a complete, HONEST strategy - lagged signal, vol-targeting, costs, out-of-sample.
import os
from datetime import datetime

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
c = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2019-01-01", end_date=end)["close"]
r = c.pct_change()

# 1. SIGNAL (hypothesis: trend) - LAGGED so there is no look-ahead (Ch32)
signal = np.sign(c - c.rolling(50).mean()).shift(1)
# 2. VOLATILITY TARGETING - scale exposure toward 12% annual vol (Ch25)
target = 0.12 / np.sqrt(252)
exposure = (target / r.rolling(20).std()).clip(upper=2.0).shift(1)
position = signal * exposure
# 3. COSTS - charge realistic friction on every change in position (Ch4)
strat = position * r - position.diff().abs() * 0.0002


def report(x, label):
    x = x.dropna()
    eq = (1 + x).cumprod()
    sharpe = x.mean() / x.std() * np.sqrt(252)
    cagr = (eq.iloc[-1] ** (252 / len(x)) - 1) * 100
    maxdd = (eq / eq.cummax() - 1).min() * 100
    print(f"{label:16s} Sharpe {sharpe:+.2f}   CAGR {cagr:+5.1f}%   MaxDD {maxdd:5.1f}%")


split = int(len(c) * 0.6)                       # 4. OUT-OF-SAMPLE split (Ch27)
print("Trend + vol-target + costs, NIFTY:")
report(strat[:split], "  in-sample")
report(strat[split:], "  out-of-sample")
report(r[split:], "  buy & hold (OOS)")
print("\nThe out-of-sample line, net of costs, is the only verdict that counts.")
