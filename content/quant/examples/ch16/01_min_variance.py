# Minimum-variance portfolio on 5 real Nifty stocks: the quadratic program quants solve.
import os
from datetime import datetime

import numpy as np
from openalgo import api
from scipy.optimize import minimize

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

stocks = ["RELIANCE", "HDFCBANK", "INFY", "ITC", "SBIN"]
end = datetime.now().strftime("%Y-%m-%d")

# Build the daily log-return matrix (one column per stock).
cols = {}
for s in stocks:
    px = client.history(symbol=s, exchange="NSE", interval="D",
                        start_date="2023-01-01", end_date=end)["close"]
    cols[s] = np.log(px / px.shift(1))
import pandas as pd
R = pd.DataFrame(cols).dropna()

# Annualised covariance matrix - the Sigma in w' Sigma w.
Sigma = R.cov().values * 252
n = len(stocks)


def port_vol(w):
    return np.sqrt(w @ Sigma @ w)


# Long-only minimum-variance: minimise w' Sigma w s.t. sum(w)=1, w>=0.
cons = ({"type": "eq", "fun": lambda w: w.sum() - 1.0},)
bounds = [(0.0, 1.0)] * n
res = minimize(port_vol, np.repeat(1.0 / n, n), method="SLSQP",
               bounds=bounds, constraints=cons)
w = res.x

# Closed-form (unconstrained) check: w = Sig^-1 1 / (1' Sig^-1 1).
inv1 = np.linalg.solve(Sigma, np.ones(n))
w_cf = inv1 / inv1.sum()

print("Minimum-variance weights (long-only QP):")
for s, wi in zip(stocks, w):
    print(f"  {s:9s} {wi:6.1%}")
print(f"\nPortfolio volatility   : {port_vol(w):.2%} per year")
print(f"Equal-weight volatility: {port_vol(np.repeat(1/n, n)):.2%} per year")
print(f"Closed-form min-var vol : {port_vol(w_cf):.2%}  "
      f"(weights {', '.join(f'{x:.0%}' for x in w_cf)})")
print(f"\n{len(R)} trading days, {n} stocks. Optimiser converged: {res.success}")
