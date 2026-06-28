# India VIX spikes up exactly when NIFTY falls - plot the inverse fear gauge over a year.
import os
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

nifty = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date="2025-06-28", end_date="2026-06-28")
vix = client.history(symbol="INDIAVIX", exchange="NSE_INDEX", interval="D",
                     start_date="2025-06-28", end_date="2026-06-28")

# Inverse relationship: NIFTY daily return vs same-day change in India VIX.
ret = np.log(nifty["close"] / nifty["close"].shift(1)).dropna()
corr = np.corrcoef(ret, vix["close"].diff().loc[ret.index])[0, 1]
fear_days = vix["close"].nlargest(3).index   # the year's biggest fear spikes

sns.set_theme(style="whitegrid")
fig, ax1 = plt.subplots(figsize=(9, 4.5))
ax1.plot(nifty.index, nifty["close"], color="#7c83ff", lw=1.6, label="NIFTY")
ax1.set_ylabel("NIFTY", color="#7c83ff")
ax2 = ax1.twinx()
ax2.plot(vix.index, vix["close"], color="#dc2626", lw=1.4, label="India VIX")
ax2.set_ylabel("India VIX (%)", color="#dc2626")
ax2.grid(False)
for d in fear_days:
    ax1.axvline(d, color="#dc2626", ls=":", lw=1.1, alpha=0.7)
ax1.set_title(f"India VIX spikes as NIFTY drops (return-vs-VIX-change corr {corr:+.2f})")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
peak = vix["close"].max()
print(f"NIFTY-return vs VIX-change correlation {corr:+.2f}; VIX peaked at {peak:.2f}% "
      f"on {vix['close'].idxmax().date()}. Saved {out.name}")
