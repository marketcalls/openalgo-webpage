# The equity curve of an optimised rule - great in-sample, then reality bites.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
c = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2019-01-01", end_date=end)["close"]
r = c.pct_change()
split = len(c) // 2


def sharpe(x):
    return x.mean() / x.std() * np.sqrt(252) if x.std() else 0


best_n, best_s = 20, -99
for n in range(10, 121, 5):
    sig = (c > c.rolling(n).mean()).astype(int).shift(1)
    s = sharpe((sig * r).iloc[:split].dropna())
    if s > best_s:
        best_n, best_s = n, s

sig = (c > c.rolling(best_n).mean()).astype(int).shift(1)
equity = (1 + (sig * r).fillna(0)).cumprod()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(equity.index[:split], equity.iloc[:split], color="#16a34a", lw=1.6, label="in-sample (optimised here)")
ax.plot(equity.index[split:], equity.iloc[split:], color="#dc2626", lw=1.6, label="out-of-sample (the real test)")
ax.axvline(equity.index[split], color="#888", ls="--", lw=1)
ax.set_title(f"SMA({best_n}) strategy - optimised on green, tested on red")
ax.set_ylabel("Growth of 1")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Best SMA {best_n}. In-sample Sharpe {best_s:.2f}. Out-of-sample is the curve that counts. Saved {out.name}")
