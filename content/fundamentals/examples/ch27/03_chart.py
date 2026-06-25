from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import yfinance as yf

df = yf.Ticker("AAPL").history(period="6mo")

# Two columns of the same DataFrame, drawn as two stacked panels.
sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(
    2, 1, figsize=(8, 5), sharex=True, gridspec_kw={"height_ratios": [3, 1]}
)
ax1.plot(df.index, df["Close"], color="#7c83ff", lw=1.6)
ax1.set_title("AAPL - price and volume, last 6 months")
ax1.set_ylabel("Close (USD)")
ax2.bar(df.index, df["Volume"] / 1e6, color="#9aa0c4", width=1.0)
ax2.set_ylabel("Volume (M)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Rows plotted :", len(df))
print("Columns used :", ["Close", "Volume"])
