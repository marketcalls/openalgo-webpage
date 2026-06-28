# What the bot sees: a 9/21 EMA crossover firing on a recent RELIANCE intraday series.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="1m",
                    start_date=start, end_date=end).tail(375)   # ~one session
close = df["close"]
fast, slow = ta.ema(close, 9), ta.ema(close, 21)
up = ta.crossover(fast, slow)
dn = ta.crossunder(fast, slow)
t = np.arange(len(close))

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(11, 5))
ax.plot(t, close.values, color="#3a3a3a", lw=1.1, label="RELIANCE 1m")
ax.plot(t, fast, color="#7c83ff", lw=1.3, label="EMA 9")
ax.plot(t, slow, color="#16a34a", lw=1.3, label="EMA 21")
ax.scatter(t[up], close.values[up], marker="^", s=90, color="#16a34a", zorder=5, label="buy signal")
ax.scatter(t[dn], close.values[dn], marker="v", s=90, color="#dc2626", zorder=5, label="exit signal")

ax.set_title("Algo loop view - 9/21 EMA crossover signals on RELIANCE 1m", fontsize=13)
ax.set_xlabel("minutes into the window")
ax.set_ylabel("price (Rs)")
ax.legend(loc="best", framealpha=0.9)
fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{len(close)} bars, {int(up.sum())} buy and {int(dn.sum())} exit signals "
      f"({close.index[0]:%d-%b %H:%M} to {close.index[-1]:%d-%b %H:%M}). Saved {out.name}")
