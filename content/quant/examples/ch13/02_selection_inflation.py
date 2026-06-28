# Best-of-N backtest Sharpe inflates with N - and tracks the expected max under the null.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api
from scipy.stats import norm

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2018-01-01", end_date=end)["close"].pct_change().dropna().values

rng = np.random.default_rng(11)
days, M, reps = len(r), 2000, 40
ann = np.sqrt(252.0)

# Empirical best-of-k: average the running max of k random (zero-edge) Sharpes over many reps.
best_curves = np.empty((reps, M))
for j in range(reps):
    sig = rng.integers(0, 2, size=(M, days)) * 2 - 1     # M random +/-1 strategies
    pnl = sig * r
    sharpe = pnl.mean(axis=1) / pnl.std(axis=1) * ann
    best_curves[j] = np.maximum.accumulate(sharpe)
best_of_n = best_curves.mean(axis=0)

# Theory: expected max of N iid standard normals, scaled by the null Sharpe std-error.
sr_se = np.sqrt(252.0 / days)
emc = 0.5772156649
n = np.arange(1, M + 1)
exp_max = np.where(n < 2, 0.0,
                   (1 - emc) * norm.ppf(1 - 1.0 / np.maximum(n, 2))
                   + emc * norm.ppf(1 - 1.0 / (np.maximum(n, 2) * np.e)))
hurdle = sr_se * exp_max

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(n, best_of_n, color="#7c83ff", lw=2, label="best-of-N random Sharpe (simulated)")
ax.plot(n, hurdle, color="#dc2626", lw=1.8, ls="--", label="expected max under null (selection hurdle)")
ax.set_xscale("log")
ax.set_xlabel("N strategies searched")
ax.set_ylabel("Annualised Sharpe of the winner")
ax.set_title("Selection inflation: the best of N zero-edge strategies")
ax.legend(loc="upper left")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Best-of-{M} random Sharpe averaged {best_of_n[-1]:.2f}; the null predicts a max of {hurdle[-1]:.2f}. "
      f"All luck, no edge. Saved {out.name}")
