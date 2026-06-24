# The four stylized facts of returns, in one figure - the truth classical models miss.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api
from scipy import stats

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2021-01-01", end_date=end)
r = df["close"].pct_change().dropna()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(2, 2, figsize=(10, 7))

# 1. Fat tails: real returns vs a normal curve
sns.histplot(r, bins=70, stat="density", color="#7c83ff", edgecolor="none", ax=ax[0, 0])
x = np.linspace(r.min(), r.max(), 200)
ax[0, 0].plot(x, stats.norm.pdf(x, r.mean(), r.std()), color="#16a34a", lw=2)
ax[0, 0].set_title(f"1. Fat tails (excess kurtosis {stats.kurtosis(r):.1f})")

# 2. Volatility clustering: calm and storm come in runs
ax[0, 1].plot(df.index[1:], r.abs(), color="#dc2626", lw=0.7)
ax[0, 1].set_title("2. Volatility clustering (|returns|)")

# 3. Returns themselves are nearly unpredictable (autocorrelation ~ 0)
lags = list(range(1, 16))
ax[1, 0].bar(lags, [r.autocorr(l) for l in lags], color="#7c83ff")
ax[1, 0].axhline(0, color="#555", lw=0.8)
ax[1, 0].set_title("3. Autocorrelation of returns ~ 0")

# 4. But their SIZE has memory (autocorrelation of |returns| > 0)
ax[1, 1].bar(lags, [r.abs().autocorr(l) for l in lags], color="#16a34a")
ax[1, 1].set_title("4. Autocorrelation of |returns| > 0")

fig.suptitle("NIFTY daily returns since 2021 - the stylized facts", fontsize=13)
fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{len(r)} days. Excess kurtosis {stats.kurtosis(r):.2f}, lag-1 |r| autocorr {r.abs().autocorr(1):.2f}. Saved {out.name}")
