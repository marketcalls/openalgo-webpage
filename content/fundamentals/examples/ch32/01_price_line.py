from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)

sns.set_theme(style="whitegrid")             # seaborn styles the whole figure
fig, ax = plt.subplots(figsize=(8, 4))       # one Figure, one Axes (ax)
ax.plot(df.index, df["Close"], color="#7c83ff", lw=1.8, label="Close")
ax.set_title("RELIANCE - daily close, last 6 months")
ax.set_xlabel("Date")
ax.set_ylabel("Price (Rs)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name, "-", len(df), "points")
