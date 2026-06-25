from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import yfinance as yf

tickers = ["AAPL", "MSFT", "GOOGL", "AMZN"]

# Stack each stock's daily returns into one long table with a "Stock" label column.
frames = []
for t in tickers:
    r = yf.Ticker(t).history(period="3mo")["Close"].pct_change().dropna() * 100
    frames.append(pd.DataFrame({"Stock": t, "Return": r.values}))
data = pd.concat(frames)

# Group by stock: average return and its volatility (standard deviation).
stats = data.groupby("Stock")["Return"].agg(["mean", "std"]).round(3)
print(stats)

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(stats.index, stats["std"], color="#7c83ff")
ax.set_title("Daily return volatility by stock - last 3 months")
ax.set_ylabel("Std dev of daily return (%)")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Charted volatility for", len(tickers), "stocks")
