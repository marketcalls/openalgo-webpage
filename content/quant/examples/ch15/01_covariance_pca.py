# Returns matrix for 8 Nifty stocks -> covariance matrix -> PC1, the market factor.
import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

stocks = ["RELIANCE", "HDFCBANK", "ICICIBANK", "INFY", "TCS", "SBIN", "ITC", "LT"]
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=500)).strftime("%Y-%m-%d")

# Build the returns matrix: one column per stock, one row per trading day.
cols = {}
for s in stocks:
    px = client.history(symbol=s, exchange="NSE", interval="D",
                        start_date=start, end_date=end)["close"]
    cols[s] = np.log(px / px.shift(1))
R = pd.DataFrame(cols).dropna()
print(f"Returns matrix R: {R.shape[0]} days x {R.shape[1]} stocks")

def show(names, values, nd=2):
    return {n: round(float(v), nd) for n, v in zip(names, values)}

# Covariance matrix (daily), annualised volatility on its diagonal.
cov = R.cov()
vol = np.sqrt(np.diag(cov) * 252) * 100
print("Annualised vol %:", show(stocks, vol, 1))

# Eigen-decompose the covariance matrix. Eigenvalues = variance along each axis.
evals, evecs = np.linalg.eigh(cov.values)
order = np.argsort(evals)[::-1]          # largest first
evals = evals[order]
evecs = evecs[:, order]
share = evals / evals.sum()

pc1 = evecs[:, 0]
if pc1.mean() < 0:                        # orient PC1 so it points "up with the market"
    pc1 = -pc1

print("Variance share per component %:", [round(float(x * 100), 1) for x in share])
print("PC1 loadings (the market factor):", show(stocks, pc1, 2))
print(f"PC1 explains {share[0] * 100:.1f}% of all variance - the single market factor "
      f"these {len(stocks)} stocks share.")
