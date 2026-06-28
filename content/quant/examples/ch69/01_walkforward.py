# Walk-forward: pick the SMA lookback in-sample, score it out-of-sample, fold after fold.
import os
from datetime import datetime

import numpy as np
import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
c = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2015-01-01", end_date=end)["close"]
r = c.pct_change()
ann = np.sqrt(252.0)

grid = [10, 20, 50, 100, 150, 200]          # candidate SMA lookbacks to fit
# Pre-compute the lagged P&L of every candidate once (signal known strictly before the bar).
pnl = {L: (np.sign(c - c.rolling(L).mean()).shift(1) * r) for L in grid}


def sharpe(x):
    x = x.dropna()
    return x.mean() / x.std() * ann if len(x) > 5 else np.nan


n, folds = len(c), 6
edges = np.linspace(int(n * 0.4), n, folds + 1, dtype=int)   # expanding train, 6 OOS blocks
oos_all, rows = [], []
for k in range(folds):
    tr_end, te_end = edges[k], edges[k + 1]
    best = max(grid, key=lambda L: sharpe(pnl[L].iloc[:tr_end]))   # fit on the past only
    oos = pnl[best].iloc[tr_end:te_end]                            # score on the unseen block
    oos_all.append(oos)
    rows.append((k + 1, c.index[tr_end].date(), c.index[te_end - 1].date(), best, sharpe(oos)))

agg = sharpe(pd.concat(oos_all))
print(f"Walk-forward on NIFTY daily, {n} bars, expanding train -> 6 out-of-sample folds")
print(f"{'fold':>4} {'OOS start':>12} {'OOS end':>12} {'fitted SMA':>11} {'OOS Sharpe':>11}")
for f, s, e, L, sh in rows:
    print(f"{f:>4} {str(s):>12} {str(e):>12} {L:>11} {sh:>+11.2f}")
mean_fold = np.nanmean([row[4] for row in rows])
print(f"\nMean per-fold OOS Sharpe {mean_fold:+.2f}; aggregate stitched-OOS Sharpe {agg:+.2f}.")
