from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

days = pd.RangeIndex(1, 9)
prices = pd.Series([100, 102, np.nan, np.nan, 105, 106, 104, 107.0], index=days)

# A line plot leaves a visible gap wherever data is missing.
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(days, prices, "o-", color="#c98f8f", lw=1.8, label="raw (gaps where NaN)")
ax.plot(days, prices.ffill(), "o--", color="#7c83ff", lw=1.4, alpha=0.85, label="forward-filled")
ax.set_title("Missing data - the gap, and one way to bridge it")
ax.set_xlabel("Day")
ax.set_ylabel("Price")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Missing on days:", list(days[prices.isna()]))
