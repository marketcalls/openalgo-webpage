from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True).tail(25)

# Draw each bar by hand: a thin wick (high-low) and a fat body (open-close).
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.5))
for i, (_, b) in enumerate(df.iterrows()):
    color = "#21c87a" if b["Close"] >= b["Open"] else "#e05a5a"
    ax.plot([i, i], [b["Low"], b["High"]], color=color, lw=1)              # wick
    low, high = sorted([b["Open"], b["Close"]])
    ax.add_patch(plt.Rectangle((i - 0.3, low), 0.6, max(high - low, 0.05), color=color))

ax.set_title("RELIANCE - last 25 daily candles (green up, red down)")
ax.set_ylabel("Price (Rs)")
ax.set_xticks([])

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Drew", len(df), "candles")
