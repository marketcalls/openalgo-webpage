# Parity, drawn: the backtest signal over history, with the latest live point appended in a distinct colour.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

CONFIG = {"fast": 20, "slow": 50}


def signal(df):
    """The shared signal: +1 long when fast SMA > slow SMA, else -1 short."""
    close = df["close"]
    return pd.Series(np.where(ta.sma(close, CONFIG["fast"]) > ta.sma(close, CONFIG["slow"]),
                              1, -1), index=df.index)


end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2024-06-01", end_date=end)

pos = signal(df)
hist, live = df.iloc[:-1], df.iloc[-1:]                   # all-but-last vs the live bar
live_pos = int(signal(df).iloc[-1])                      # live decision from same code

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.6))
ax.plot(hist.index, hist["close"], color="#9a9a9a", lw=1.0, zorder=1, label="NIFTY close")

# Colour the backtest by the signal's position state - this is what research saw
long_m = pos.iloc[:-1] == 1
ax.scatter(hist.index[long_m], hist["close"][long_m], s=10, color="#16a34a", label="backtest long")
ax.scatter(hist.index[~long_m], hist["close"][~long_m], s=10, color="#dc2626", label="backtest short")

# The latest LIVE point, same signal, drawn in a distinct colour on the same curve
ax.scatter(live.index, live["close"], s=140, color="#7c83ff", edgecolor="black",
           zorder=5, marker="*", label="live bar (same code)")
ax.annotate(f"  live: {'LONG' if live_pos == 1 else 'SHORT'}",
            (live.index[-1], live["close"].iloc[-1]), color="#7c83ff", fontweight="bold")

ax.set_title("Backtest history and the live bar share one signal - parity by construction")
ax.set_ylabel("NIFTY")
ax.legend(loc="upper left", fontsize=8, ncol=2)
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"NIFTY {df.index[0].date()} -> {df.index[-1].date()}: live bar decision "
      f"{'LONG' if live_pos == 1 else 'SHORT'}, same signal() as the backtest. Saved {out.name}")
