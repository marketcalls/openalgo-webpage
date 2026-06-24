# The efficient frontier: thousands of random portfolios, and the best risk-return edge.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=730)).strftime("%Y-%m-%d")
syms = ["RELIANCE", "INFY", "HDFCBANK", "ITC", "TATASTEEL"]
rets = pd.DataFrame({s: client.history(symbol=s, exchange="NSE", interval="D",
                                       start_date=start, end_date=end)["close"].pct_change()
                     for s in syms}).dropna()

mean, cov = rets.mean() * 252, rets.cov() * 252
rng = np.random.default_rng(1)
risk, ret, sharpe = [], [], []
for _ in range(4000):
    w = rng.random(len(syms))
    w /= w.sum()
    pr = w @ mean
    pv = np.sqrt(w @ cov @ w)
    risk.append(pv * 100)
    ret.append(pr * 100)
    sharpe.append(pr / pv)

best = int(np.argmax(sharpe))
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sc = ax.scatter(risk, ret, c=sharpe, cmap="viridis", s=8, alpha=0.6)
ax.scatter(risk[best], ret[best], color="#dc2626", s=120, marker="*", label="max-Sharpe portfolio")
fig.colorbar(sc, label="Sharpe ratio")
ax.set_title("The efficient frontier - 4000 random portfolios of 5 NSE stocks")
ax.set_xlabel("Risk (annualised volatility %)")
ax.set_ylabel("Return (annualised %)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Best Sharpe {sharpe[best]:.2f} at risk {risk[best]:.1f}%, return {ret[best]:.1f}%. Saved {out.name}")
