# Monte Carlo: resample real Nifty days to see the RANGE of luck over a year.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2021-01-01", end_date=end)
log_r = np.log(df["close"] / df["close"].shift(1)).dropna().values

rng = np.random.default_rng(7)            # seeded, so the run is reproducible
N_SIMS, DAYS = 500, 252
sims = np.array([100 * np.exp(np.cumsum(rng.choice(log_r, size=DAYS, replace=True)))
                 for _ in range(N_SIMS)])

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
for path in sims[:200]:
    ax.plot(path, color="#7c83ff", alpha=0.05)
ax.plot(np.percentile(sims, 50, axis=0), color="#16a34a", lw=2, label="median outcome")
ax.plot(np.percentile(sims, 5, axis=0), color="#dc2626", lw=1.5, ls="--", label="5th / 95th percentile")
ax.plot(np.percentile(sims, 95, axis=0), color="#dc2626", lw=1.5, ls="--")
ax.set_title("500 simulated years of Nifty - the same edge, very different luck")
ax.set_xlabel("Trading day")
ax.set_ylabel("Growth of 100")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
finals = sims[:, -1]
print(f"After 1 year - median {np.median(finals):.0f}, "
      f"unlucky 5th {np.percentile(finals, 5):.0f}, lucky 95th {np.percentile(finals, 95):.0f}. Saved {out.name}")
