# Live monitoring: track a position's running P&L and trip an alert when the loss limit breaks.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# One real RELIANCE session of 5-minute bars; hold long 1 lot (500 sh) from the open.
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")
bars = client.history(symbol="RELIANCE", exchange="NSE", interval="5m",
                      start_date=start, end_date=end)
day = bars.index[-1].date()
s = bars[bars.index.date == day]

QTY = 500
entry = s["close"].iloc[0]
pnl = (s["close"] - entry) * QTY          # the monitored metric: running mark-to-market P&L
LIMIT = -2500                              # hard intraday loss limit set by the risk monitor

breached = pnl[pnl <= LIMIT]
trip = breached.index[0] if len(breached) else None

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.6))
ax.plot(s.index, pnl, color="#7c83ff", lw=1.6, label="Running P&L")
ax.axhline(0, color="#9a9a9a", lw=0.9)
ax.axhline(LIMIT, color="#dc2626", lw=1.4, ls="--", label=f"Loss limit Rs {LIMIT:,}")
ax.fill_between(s.index, pnl, LIMIT, where=(pnl <= LIMIT), color="#dc2626", alpha=0.25)
if trip is not None:
    ax.scatter([trip], [pnl.loc[trip]], color="#dc2626", zorder=5, s=40)
    ax.annotate("ALERT: limit breached", (trip, pnl.loc[trip]),
                textcoords="offset points", xytext=(8, -18), color="#dc2626", fontsize=9)
ax.set_title(f"RELIANCE intraday P&L monitor - long {QTY} sh, {day}")
ax.set_ylabel("Running P&L (Rs)")
ax.set_xlabel("Time")
ax.legend(loc="upper right", fontsize=8)
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

trip_txt = trip.strftime("%H:%M") if trip is not None else "never"
print(f"Session {day}: P&L low Rs {pnl.min():,.0f}, limit Rs {LIMIT:,}, breached at {trip_txt}. Saved {out.name}")
