# Test 200 zero-edge signals on real Nifty, count false discoveries at p<0.05, then correct.
import os
from datetime import datetime

import numpy as np
from openalgo import api
from scipy import stats
from statsmodels.stats.multitest import multipletests

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2018-01-01", end_date=end)["close"].pct_change().dropna().values

rng = np.random.default_rng(7)
N, days = 200, len(r)

# Each "signal" is a random long/short rule with NO real edge. Test its daily P&L.
pvals = np.empty(N)
for i in range(N):
    signal = rng.choice([1, -1], size=days)        # pure noise, expected edge = 0
    pnl = signal * r
    pvals[i] = stats.ttest_1samp(pnl, 0.0).pvalue   # H0: mean daily return = 0

naive = (pvals < 0.05).sum()
bonf = multipletests(pvals, alpha=0.05, method="bonferroni")[0].sum()
holm = multipletests(pvals, alpha=0.05, method="holm")[0].sum()
bh = multipletests(pvals, alpha=0.05, method="fdr_bh")[0].sum()

print(f"Tested {N} ZERO-edge signals on {days} days of Nifty (2018 to date).")
print(f"Naive p<0.05            : {naive:3d} 'discoveries'  (expected by luck ~{int(0.05*N)})")
print(f"Bonferroni (FWER 5%)    : {bonf:3d} survive   threshold p<{0.05/N:.5f}")
print(f"Holm step-down (FWER 5%): {holm:3d} survive")
print(f"Benjamini-Hochberg FDR  : {bh:3d} survive")
print(f"\n{naive} fake edges passed the naive test; corrections killed all but {max(bonf, holm, bh)} of them.")
