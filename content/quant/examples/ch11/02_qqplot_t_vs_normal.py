# QQ-plot of NIFTY returns: a fitted normal abandons the tails, a Student-t hugs them.
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
                    start_date="2015-01-01", end_date=end)
r = np.log(df["close"] / df["close"].shift(1)).dropna()

# Fit a Student-t to the standardised returns; estimate its tail-heaviness (df)
zr = (r - r.mean()) / r.std()
nu, _, _ = stats.t.fit(zr, floc=0)            # nu = degrees of freedom (lower = fatter)

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(1, 2, figsize=(11, 4.6))

# Left: QQ-plot of empirical quantiles vs a fitted normal
osm, osr = stats.probplot(zr, dist="norm", fit=False)
ax[0].scatter(osm, osr, s=10, color="#7c83ff", edgecolor="none")
lim = [min(osm.min(), osr.min()), max(osm.max(), osr.max())]
ax[0].plot(lim, lim, color="#16a34a", lw=2, label="normal reference")
ax[0].set_title("QQ-plot vs normal: tails fly off the line")
ax[0].set_xlabel("normal quantiles")
ax[0].set_ylabel("NIFTY return quantiles")
ax[0].legend(loc="upper left")

# Right: log-density histogram with a fitted normal and a fitted Student-t
sns.histplot(zr, bins=120, stat="density", color="#cdd0ff", edgecolor="none", ax=ax[1])
x = np.linspace(zr.min(), zr.max(), 400)
ax[1].plot(x, stats.norm.pdf(x), color="#16a34a", lw=2, label="fitted normal")
ax[1].plot(x, stats.t.pdf(x, nu), color="#dc2626", lw=2, label=f"fitted t (nu={nu:.1f})")
ax[1].set_yscale("log")
ax[1].set_ylim(1e-4, 1)
ax[1].set_title("Log-density: the t hugs the fat tails")
ax[1].set_xlabel("standardised daily return (sigmas)")
ax[1].legend(loc="upper right")

fig.suptitle("NIFTY daily returns since 2015 - normal versus Student-t", fontsize=13)
fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{len(r)} days. Fitted Student-t df nu={nu:.1f} (fat: a normal is nu=inf). Saved {out.name}")
