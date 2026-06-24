# The pairs-trade equity curve - market-neutral gains that ignore the index.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import statsmodels.api as sm
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")


def close(sym, exch="NSE"):
    return client.history(symbol=sym, exchange=exch, interval="D",
                          start_date="2021-01-01", end_date=end)["close"]


df = pd.concat([close("RELIANCE"), close("ONGC")], axis=1).dropna()
df.columns = ["a", "b"]
hedge = sm.OLS(df["a"], sm.add_constant(df["b"])).fit().params.iloc[1]
spread = df["a"] - hedge * df["b"]
z = (spread - spread.rolling(60).mean()) / spread.rolling(60).std()

pos, p = [], 0
for zi in z:
    if not np.isnan(zi):
        if p == 0 and zi > 2:
            p = -1
        elif p == 0 and zi < -2:
            p = 1
        elif p != 0 and abs(zi) < 0.5:
            p = 0
    pos.append(p)
pos = pd.Series(pos, index=z.index)
equity = (pos.shift(1) * spread.diff()).fillna(0).cumsum()

nifty = close("NIFTY", "NSE_INDEX")
nifty_norm = (nifty / nifty.iloc[0] - 1) * 100

sns.set_theme(style="whitegrid")
fig, ax1 = plt.subplots(figsize=(8, 4.5))
ax1.plot(equity.index, equity, color="#16a34a", lw=1.8, label="pairs P&L (points)")
ax1.set_ylabel("Pairs P&L (spread points)", color="#16a34a")
ax2 = ax1.twinx()
ax2.plot(nifty_norm.index, nifty_norm, color="#888", lw=1.2, ls="--", label="NIFTY %")
ax2.set_ylabel("NIFTY return %", color="#888")
ax2.grid(False)
ax1.set_title("Reliance-ONGC pairs trade vs the market - notice they don't move together")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Pairs P&L {equity.iloc[-1]:.0f} points, while NIFTY did {nifty_norm.iloc[-1]:+.0f}%. Saved {out.name}")
