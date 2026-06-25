from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
ret = (df["Close"].pct_change() * 100).dropna()

# One figure can hold several Axes side by side - here, two views at once.
sns.set_theme(style="whitegrid")
fig, (ax_left, ax_right) = plt.subplots(1, 2, figsize=(10, 4))

ax_left.plot(df.index, df["Close"], color="#7c83ff", lw=1.6)
ax_left.set_title("Price over time")
ax_left.set_ylabel("Rs")

ax_right.hist(ret, bins=20, color="#21c87a", alpha=0.85)
ax_right.set_title("Spread of daily returns")
ax_right.set_xlabel("%")

fig.suptitle("RELIANCE - two views of the same data", fontsize=13)
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved a two-panel figure")
