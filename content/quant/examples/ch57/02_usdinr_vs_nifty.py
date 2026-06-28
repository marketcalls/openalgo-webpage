# USD-INR vs NIFTY over the last year, both rebased to 100 - the macro link.
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

usd = client.history(symbol="USDINR29JUL26FUT", exchange="CDS", interval="D",
                     start_date="2025-06-28", end_date="2026-06-28")
nif = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                     start_date="2025-06-28", end_date="2026-06-28")

# Align on common trading days and rebase both series to 100 at the start.
common = usd.index.intersection(nif.index)
u, n = usd["close"].reindex(common), nif["close"].reindex(common)
u100, n100 = u / u.iloc[0] * 100, n / n.iloc[0] * 100
corr = np.log(u / u.shift(1)).corr(np.log(n / n.shift(1)))

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.4))
ax.plot(common, n100, color="#7c83ff", lw=1.6, label="NIFTY (equity index)")
ax.plot(common, u100, color="#dc2626", lw=1.6, label="USD-INR future (up = weaker rupee)")
ax.axhline(100, color="#888", lw=0.8, ls="--")
ax.set_title("USD-INR vs NIFTY over the last year (rebased to 100)")
ax.set_ylabel("Level (start = 100)")
ax.legend(loc="best", frameon=False)
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

print(f"Window            : {common[0].date()} to {common[-1].date()} ({len(common)} days)")
print(f"USD-INR move      : {u.iloc[0]:.2f} -> {u.iloc[-1]:.2f}  ({(u.iloc[-1] / u.iloc[0] - 1) * 100:+.1f}%)")
print(f"NIFTY move        : {n.iloc[0]:.0f} -> {n.iloc[-1]:.0f}  ({(n.iloc[-1] / n.iloc[0] - 1) * 100:+.1f}%)")
print(f"Daily-return corr : {corr:+.2f}  (mildly inverse: a weaker rupee leans against equities)")
print(f"Saved chart       : {out.name}")
