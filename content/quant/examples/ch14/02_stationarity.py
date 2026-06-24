# See stationarity: price wanders with no anchor, returns snap back to a mean.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api
from statsmodels.tsa.stattools import adfuller

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2021-01-01", end_date=end)
p = df["close"]
r = p.pct_change().dropna() * 100

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(2, 1, figsize=(8, 6), sharex=True)

ax[0].plot(p.index, p, color="#7c83ff", lw=1.3)
ax[0].set_title(f"NIFTY price - NON-stationary (ADF p = {adfuller(p)[1]:.2f}): wanders off")
ax[0].set_ylabel("Price")

ax[1].plot(r.index, r, color="#16a34a", lw=0.7)
ax[1].axhline(r.mean(), color="#dc2626", lw=1.4, label=f"mean {r.mean():.2f}%")
ax[1].set_title(f"NIFTY daily returns - STATIONARY (ADF p = {adfuller(r)[1]:.3f}): pulled to a mean")
ax[1].set_ylabel("Return (%)")
ax[1].legend()

fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Price ADF p={adfuller(p)[1]:.2f} (random walk), returns ADF p={adfuller(r)[1]:.3f} (stationary). Saved {out.name}")
