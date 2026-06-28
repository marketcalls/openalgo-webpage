# The capstone tearsheet: equity curve vs buy-and-hold, with drawdown - the honest picture.
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

signal = np.sign(c - c.rolling(50).mean()).shift(1)
exposure = (0.12 / np.sqrt(252) / r.rolling(20).std()).clip(upper=2.0).shift(1)
strat = (signal * exposure * r - (signal * exposure).diff().abs() * 0.0002).fillna(0)

eq_strat = (1 + strat).cumprod()
eq_hold = (1 + r.fillna(0)).cumprod()
dd = (eq_strat / eq_strat.cummax() - 1) * 100
split = int(len(c) * 0.6)

sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6), sharex=True,
                               gridspec_kw={"height_ratios": [3, 1]})
ax1.plot(eq_strat.index, eq_strat, color="#7c83ff", lw=1.6, label="strategy (net of costs)")
ax1.plot(eq_hold.index, eq_hold, color="#888", lw=1.3, ls="--", label="buy & hold")
ax1.axvline(eq_strat.index[split], color="#dc2626", lw=1, ls=":")
ax1.text(eq_strat.index[split], eq_strat.max() * 0.6, " out-of-sample ->", color="#dc2626", fontsize=9)
ax1.set_title("Capstone: trend + vol-target + costs vs buy-and-hold")
ax1.set_ylabel("Growth of 1")
ax1.legend(loc="upper left")
ax2.fill_between(dd.index, dd, 0, color="#dc2626", alpha=0.3)
ax2.set_ylabel("Drawdown %")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Strategy {eq_strat.iloc[-1]:.2f}x vs buy-hold {eq_hold.iloc[-1]:.2f}x, worst drawdown {dd.min():.0f}%. Saved {out.name}")
