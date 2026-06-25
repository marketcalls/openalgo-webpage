from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
close = df["Close"]

# A rolling window: the 20-day moving average smooths out the daily noise.
sma20 = close.rolling(20).mean()

# shift(1) looks back one row - the basis of a return: today vs yesterday.
returns = (close / close.shift(1) - 1) * 100

print("Latest close      :", round(close.iloc[-1], 2))
print("20-day average    :", round(sma20.iloc[-1], 2))
print("Yesterday's return:", round(returns.iloc[-1], 2), "%")

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(close.index, close, color="#9aa0c4", lw=1.2, label="Close")
ax.plot(sma20.index, sma20, color="#7c83ff", lw=2.0, label="20-day average")
ax.set_title("RELIANCE close with its 20-day moving average")
ax.set_ylabel("Price (Rs)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved chart of", close.size, "days")
