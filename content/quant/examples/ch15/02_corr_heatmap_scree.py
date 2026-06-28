# Correlation heatmap + PCA scree and PC1/PC2 loadings for 8 Nifty stocks.
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
from sklearn.decomposition import PCA

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

stocks = ["RELIANCE", "HDFCBANK", "ICICIBANK", "INFY", "TCS", "SBIN", "ITC", "LT"]
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=500)).strftime("%Y-%m-%d")

cols = {}
for s in stocks:
    px = client.history(symbol=s, exchange="NSE", interval="D",
                        start_date=start, end_date=end)["close"]
    cols[s] = np.log(px / px.shift(1))
R = pd.DataFrame(cols).dropna()

# PCA on standardised returns so every stock weighs equally.
Z = (R - R.mean()) / R.std()
pca = PCA().fit(Z)
share = pca.explained_variance_ratio_
load = pd.DataFrame(pca.components_[:2].T, index=stocks, columns=["PC1", "PC2"])
if load["PC1"].mean() < 0:
    load = -load

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(1, 3, figsize=(15, 4.6))

sns.heatmap(R.corr(), annot=True, fmt=".2f", cmap="rocket_r", vmin=0, vmax=1,
            cbar=False, ax=ax[0])
ax[0].set_title("Correlation of daily returns")

ax[1].bar(range(1, len(share) + 1), share * 100, color="#7c83ff")
ax[1].set_title(f"Scree: PC1 = {share[0] * 100:.0f}% of variance")
ax[1].set_xlabel("Principal component")
ax[1].set_ylabel("Variance explained %")

load.plot.bar(ax=ax[2], color=["#16a34a", "#dc2626"], legend=True)
ax[2].axhline(0, color="#555", lw=0.8)
ax[2].set_title("PC1 (market) and PC2 (tilt) loadings")
ax[2].tick_params(axis="x", rotation=45)

fig.suptitle("8 Nifty stocks: correlation, PCA scree and loadings", fontsize=13)
fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{R.shape[0]} days, {R.shape[1]} stocks. PC1 {share[0]*100:.1f}%, "
      f"PC2 {share[1]*100:.1f}%. Mean pairwise corr {R.corr().values[np.triu_indices(8,1)].mean():.2f}. Saved {out.name}")
