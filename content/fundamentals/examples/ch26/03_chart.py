from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import yfinance as yf

closes = yf.Ticker("AAPL").history(period="3mo")["Close"]

# A Series knows how to plot itself - the date index becomes the x-axis.
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4))
closes.plot(ax=ax, color="#7c83ff", lw=1.8)
ax.set_title("AAPL daily close - last 3 months")
ax.set_ylabel("Price (USD)")
ax.set_xlabel("")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Plotted", len(closes), "closing prices. Saved", out.name)
print("Range:", round(closes.min(), 2), "to", round(closes.max(), 2))
