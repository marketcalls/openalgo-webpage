# One mean-reverting series: price vs its mean, and the deviation oscillating around zero.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import statsmodels.api as sm
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
px = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date="2021-01-01", end_date=end)["close"]

sma20 = px.rolling(20).mean()
x = np.log(px / sma20).dropna()                 # log-deviation from the 20-day mean

# Half-life of reversion from the OU fit (regress the daily change on the level).
dx = x.diff().dropna()
lag = x.shift(1).loc[dx.index]
beta = sm.OLS(dx, sm.add_constant(lag)).fit().params
kappa = -beta.iloc[1]
halflife = np.log(2) / kappa
sd = x.std()

sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6), sharex=True)

ax1.plot(px.index, px, color="#7c83ff", lw=1, label="RELIANCE close")
ax1.plot(sma20.index, sma20, color="#dc2626", lw=1.3, ls="--", label="20-day mean")
ax1.set_title("A single mean-reverting series: price is pulled back to its own average")
ax1.set_ylabel("Price (Rs)")
ax1.legend(loc="upper left")

ax2.plot(x.index, x, color="#7c83ff", lw=0.9)
ax2.axhline(0, color="#555", lw=1)
ax2.axhline(sd, color="#16a34a", ls="--", lw=1.1)
ax2.axhline(-sd, color="#16a34a", ls="--", lw=1.1, label="+/-1 sigma")
ax2.fill_between(x.index, 0, x, where=(x > sd), color="#dc2626", alpha=0.22)
ax2.fill_between(x.index, 0, x, where=(x < -sd), color="#16a34a", alpha=0.22)
ax2.set_ylabel("Log-deviation")
ax2.set_title(f"Deviation oscillating around zero  -  half-life {halflife:.1f} days (kappa {kappa:.3f}/day)")
ax2.legend(loc="upper left")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"RELIANCE deviation: half-life {halflife:.1f} days, kappa {kappa:.3f}/day, latest {x.iloc[-1]:+.3f}. Saved {out.name}")
