from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

# Load straight from the CSV - no internet needed once it is saved.
df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(df.index, df["Close"], color="#21c87a", lw=1.7)
ax.set_title("RELIANCE (NSE) - close, last 6 months")
ax.set_ylabel("Price (Rs)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Charted", len(df), "rows loaded from the CSV")
