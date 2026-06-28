# Intraday day chart: opening-range box, session VWAP, and the breakout that faded back to VWAP.
import os
import time
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def history(symbol, exchange, interval, start, end):
    for _ in range(4):
        r = client.history(symbol=symbol, exchange=exchange, interval=interval,
                           start_date=start, end_date=end)
        if hasattr(r, "index"):
            return r
        time.sleep(1)
    raise SystemExit("no data")


SYM = "RELIANCE"
df = history(SYM, "NSE", "5m", "2026-06-22", "2026-06-28")
day = sorted(set(df.index.date))[-1]
d = df[df.index.date == day].copy()
d.index = d.index.tz_localize(None)            # plot in local IST clock time
d["vwap"] = np.asarray(ta.vwap(d["high"], d["low"], d["close"], d["volume"]))

# Opening range (first 15 minutes) and the first close beyond it.
or_high, or_low = d.iloc[:3]["high"].max(), d.iloc[:3]["low"].min()
rest = d.iloc[3:]
bo_t = bo_px = None
for i, (t, row) in enumerate(rest.iterrows()):
    if row["close"] > or_high or row["close"] < or_low:
        bo_t, bo_px, bo_i = t, row["close"], i
        break

# Reversion: first bar after the breakout where price closes back through VWAP.
rev_t = rev_px = None
for t, row in rest.iloc[bo_i + 1:].iterrows():
    if (bo_px > or_high and row["close"] < row["vwap"]) or (bo_px < or_low and row["close"] > row["vwap"]):
        rev_t, rev_px = t, row["close"]
        break

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8.5, 4.6))
ax.plot(d.index, d["close"], color="#7c83ff", lw=1.5, label="price (5m close)")
ax.plot(d.index, d["vwap"], color="#16a34a", lw=1.6, ls="--", label="session VWAP")
ax.axhspan(or_low, or_high, color="#9a9a9a", alpha=0.18)
ax.axhline(or_high, color="#9a9a9a", lw=1)
ax.axhline(or_low, color="#9a9a9a", lw=1)
ax.text(d.index[0], or_high, " opening range", va="bottom", fontsize=8, color="#555")
ax.scatter([bo_t], [bo_px], color="#16a34a", s=90, zorder=5, marker="^", label="breakout")
if rev_t is not None:
    ax.scatter([rev_t], [rev_px], color="#dc2626", s=90, zorder=5, marker="v", label="VWAP reversion")
ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))
ax.set_title(f"{SYM} {day}  -  opening-range breakout that faded back through VWAP")
ax.set_ylabel("Price (Rs)")
ax.legend(loc="upper right", fontsize=8)

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{SYM} {day}: OR {or_low:.1f}-{or_high:.1f}, broke up @ {bo_t.time()} ({bo_px:.1f}), "
      f"reverted below VWAP @ {rev_t.time()} ({rev_px:.1f}), closed {d['close'].iloc[-1]:.1f}. Saved {out.name}")
