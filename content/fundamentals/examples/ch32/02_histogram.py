from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
ret = (df["Close"].pct_change() * 100).dropna()

# A histogram shows the SHAPE of the returns - how often each size of move happens.
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4))
sns.histplot(ret, bins=25, kde=True, color="#7c83ff", ax=ax)
ax.axvline(0, color="#888", ls="--", lw=1)
ax.set_title("RELIANCE - distribution of daily returns")
ax.set_xlabel("Daily return (%)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Mean:", round(ret.mean(), 3), "%  Std:", round(ret.std(), 3), "%")
