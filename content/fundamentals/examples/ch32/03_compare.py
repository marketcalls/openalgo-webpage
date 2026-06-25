from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import yfinance as yf

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4))

# Rebase each stock to 100 so they start together - a fair growth comparison.
for ticker, color in [("AAPL", "#7c83ff"), ("MSFT", "#21c87a")]:
    close = yf.Ticker(ticker).history(period="6mo")["Close"]
    rebased = close / close.iloc[0] * 100
    ax.plot(rebased.index, rebased, lw=1.8, label=ticker, color=color)

ax.axhline(100, color="#888", ls="--", lw=1)
ax.set_title("Growth of 100 - AAPL vs MSFT, last 6 months")
ax.set_ylabel("Rebased to 100")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Compared 2 stocks, each rebased to 100")
