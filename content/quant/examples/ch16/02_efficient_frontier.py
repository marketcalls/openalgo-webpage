# The efficient frontier from 5 real Nifty stocks, with the minimum-variance point marked.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from openalgo import api
from scipy.optimize import minimize

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

stocks = ["RELIANCE", "HDFCBANK", "INFY", "ITC", "SBIN"]
end = datetime.now().strftime("%Y-%m-%d")

cols = {}
for s in stocks:
    px = client.history(symbol=s, exchange="NSE", interval="D",
                        start_date="2023-01-01", end_date=end)["close"]
    cols[s] = np.log(px / px.shift(1))
R = pd.DataFrame(cols).dropna()

mu = R.mean().values * 252          # annualised expected returns
Sigma = R.cov().values * 252        # annualised covariance
n = len(stocks)


def vol(w):
    return np.sqrt(w @ Sigma @ w)


def frontier_point(target):
    cons = ({"type": "eq", "fun": lambda w: w.sum() - 1.0},
            {"type": "eq", "fun": lambda w: w @ mu - target})
    res = minimize(vol, np.repeat(1 / n, n), method="SLSQP",
                   bounds=[(0, 1)] * n, constraints=cons)
    return res.x

# Minimum-variance portfolio (no return target).
mv = minimize(vol, np.repeat(1 / n, n), method="SLSQP",
              bounds=[(0, 1)] * n,
              constraints=({"type": "eq", "fun": lambda w: w.sum() - 1.0},)).x

targets = np.linspace(mu.min(), mu.max(), 40)
fvol = [vol(frontier_point(t)) for t in targets]

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8.5, 5.5))
ax.plot(fvol, targets, color="#7c83ff", lw=2.2, label="Efficient frontier")
ax.scatter(np.sqrt(np.diag(Sigma)), mu, color="#dc2626", s=55, zorder=5)
for s, v, m in zip(stocks, np.sqrt(np.diag(Sigma)), mu):
    ax.annotate(s, (v, m), textcoords="offset points", xytext=(7, 2), fontsize=9)
ax.scatter([vol(mv)], [mv @ mu], color="#16a34a", s=130, marker="*",
           zorder=6, label="Minimum variance")
ax.set_xlabel("Annualised volatility")
ax.set_ylabel("Annualised expected return")
ax.set_title("Efficient frontier - 5 Nifty stocks (2023-present)")
ax.legend()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Min-variance point: vol {vol(mv):.2%}, return {mv @ mu:.2%}. "
      f"Frontier spans vol {min(fvol):.2%}-{max(fvol):.2%}. Saved {out.name}")
