# A Sharpe HEATMAP: return alone can hide wild risk -- Sharpe rewards smoothness.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=500)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]

combos = [(f, s) for f in (5, 10, 15, 20) for s in (30, 40, 50, 60) if f < s]
ent, ext = {}, {}
for f, s in combos:
    fe, se = ta.ema(close, f), ta.ema(close, s)
    ent[(f, s)] = (fe > se) & (fe.shift(1) <= se.shift(1))
    ext[(f, s)] = (fe < se) & (fe.shift(1) >= se.shift(1))
cols = pd.MultiIndex.from_tuples(combos, names=["fast", "slow"])
pf = vbt.Portfolio.from_signals(close, pd.DataFrame(ent).set_axis(cols, axis=1),
                                pd.DataFrame(ext).set_axis(cols, axis=1),
                                init_cash=100000, fees=0.001, freq="1D")

grid = pf.sharpe_ratio().unstack("slow")             # risk-adjusted score per combo
fig, ax = plt.subplots(figsize=(7, 4))
im = ax.imshow(grid.values, cmap="RdYlGn", aspect="auto")
ax.set_xticks(range(len(grid.columns)), grid.columns); ax.set_xlabel("slow EMA")
ax.set_yticks(range(len(grid.index)), grid.index); ax.set_ylabel("fast EMA")
ax.set_title("RELIANCE Sharpe ratio by EMA combo")
fig.colorbar(im, label="Sharpe")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
print("Best Sharpe combo:", pf.sharpe_ratio().idxmax())
