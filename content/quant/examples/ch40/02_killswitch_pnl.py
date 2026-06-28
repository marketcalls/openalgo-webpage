# A runaway strategy hitting a daily-loss kill switch: managed P&L flatlines once it trips.
import os
from datetime import datetime, timedelta
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

# --- anchor the simulation to REAL per-bar volatility of a liquid name ---
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="5m",
                    start_date=start, end_date=end)
sigma = df["close"].pct_change().dropna().std()   # real 5m return std

# --- the runaway: a bug re-adds to a losing book every bar (position keeps growing) ---
rng = np.random.default_rng(42)
N = 75                                  # one 5m session
DAILY_LOSS_LIMIT = 50_000               # rupees; the kill-switch trip level
ADD_PER_BAR = 5_00_000                  # notional piled on each bar (the runaway)
DRIFT = -0.0004                         # adverse per-bar drift: a negative-edge strategy

notional = ADD_PER_BAR * np.arange(1, N + 1)            # exposure grows each bar
ret = rng.normal(DRIFT, sigma, N)                       # per-bar market move
bar_pnl = notional * ret                                # rupees made/lost per bar
unmanaged = np.cumsum(bar_pnl)                          # no risk control at all

# --- the kill switch: first time cumulative loss breaches the limit, flatten and freeze ---
managed = unmanaged.copy()
trip = np.argmax(unmanaged <= -DAILY_LOSS_LIMIT) if (unmanaged <= -DAILY_LOSS_LIMIT).any() else -1
if trip >= 0:
    managed[trip:] = unmanaged[trip]                    # P&L flatlines from the trip bar on

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(11, 5))
t = np.arange(N)
ax.plot(t, unmanaged, color="#dc2626", lw=1.6, label="no kill switch (runaway)")
ax.plot(t, managed, color="#7c83ff", lw=1.8, label="kill switch active")
ax.axhline(-DAILY_LOSS_LIMIT, color="#16a34a", ls="--", lw=1.2,
           label=f"loss limit Rs {DAILY_LOSS_LIMIT:,}")
if trip >= 0:
    ax.scatter([trip], [managed[trip]], color="#7c83ff", s=80, zorder=5)
    ax.annotate("switch trips - book flattened", (trip, managed[trip]),
                textcoords="offset points", xytext=(12, 14), fontsize=10, color="#7c83ff")
ax.set_title("Daily-loss kill switch caps a runaway strategy (RELIANCE 5m vol)", fontsize=13)
ax.set_xlabel("5-minute bars into the session")
ax.set_ylabel("cumulative P&L (Rs)")
ax.legend(loc="lower left", framealpha=0.9)
fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

print(f"sigma {sigma*100:.3f}%/bar; switch trips at bar {trip}; managed P&L frozen at "
      f"Rs {managed[-1]:,.0f} vs runaway Rs {unmanaged[-1]:,.0f}. Saved {out.name}")
