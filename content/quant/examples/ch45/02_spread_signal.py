# The pairs trade itself: build the spread, z-score it, and read the entry/exit bands.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import statsmodels.api as sm
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
A, B = "KOTAKBANK", "HDFCBANK"                          # the cointegrated pair from example 1


def close(symbol):
    return client.history(symbol=symbol, exchange="NSE", interval="D",
                          start_date="2021-01-01", end_date=end)["close"]


df = pd.concat([close(A), close(B)], axis=1).dropna()
df.columns = [A, B]
hedge = sm.OLS(df[A], sm.add_constant(df[B])).fit().params.iloc[1]
spread = df[A] - hedge * df[B]                          # market-neutral spread
z = (spread - spread.mean()) / spread.std()            # standardised signal

sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6), sharex=True)

ax1.plot(spread.index, spread, color="#7c83ff", lw=1)
ax1.axhline(spread.mean(), color="#555", lw=1, ls="--")
ax1.set_title(f"{A} - {hedge:.2f} x {B}: the spread and its z-score signal")
ax1.set_ylabel("Spread (Rs)")

ax2.plot(z.index, z, color="#7c83ff", lw=1)
ax2.axhline(0, color="#555", lw=1)
ax2.axhline(2, color="#dc2626", ls="--", lw=1.4, label="+/-2 sigma (entry)")
ax2.axhline(-2, color="#16a34a", ls="--", lw=1.4)
ax2.fill_between(z.index, 2, z, where=(z > 2), color="#dc2626", alpha=0.25)
ax2.fill_between(z.index, -2, z, where=(z < -2), color="#16a34a", alpha=0.25)
ax2.set_ylabel("Z-score")
ax2.legend(loc="upper left")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
hits = int((z.abs() > 2).sum())
print(f"{A}/{B}: hedge {hedge:.2f}, latest z {z.iloc[-1]:+.2f}; "
      f"spread breached +/-2 sigma on {hits} days. Saved {out.name}")
