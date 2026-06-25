from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import yfinance as yf

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4))

# Rebase each index to 100 so we compare growth, not levels.
for name, sym, color in [("Nifty 50 (India)", "^NSEI", "#21c87a"),
                         ("S&P 500 (US)", "^GSPC", "#7c83ff")]:
    close = yf.Ticker(sym).history(period="1y")["Close"].dropna()
    ax.plot(close.index, close / close.iloc[0] * 100, lw=1.8, label=name, color=color)

ax.axhline(100, color="#888", ls="--", lw=1)
ax.set_title("One year, rebased to 100: India vs US")
ax.set_ylabel("Rebased to 100")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Charted Nifty 50 vs S&P 500, rebased to 100")
