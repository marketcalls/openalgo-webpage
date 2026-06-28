# A log-log map of the three tiers: holding period vs trades per day.
# The two retail-reachable points are measured from real NIFTY data; HFT is a labelled reference.
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


def tier(interval, start, sec_per_bar):
    df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval=interval,
                        start_date=start, end_date=end)
    c = df["close"]
    sig = np.sign(ta.ema(c, 9) - ta.ema(c, 21))
    sig = sig[~np.isnan(sig)]
    flips = int((np.diff(sig) != 0).sum())
    n_days = df.index.normalize().nunique()
    trades_per_day = flips / n_days
    hold_sec = (len(df) / flips) * sec_per_bar       # avg bars held -> seconds
    return hold_sec, trades_per_day


# Two REAL points from data: an intraday algo (1m) and a systematic book (daily).
intraday = tier("1m", (datetime.now() - timedelta(days=20)).strftime("%Y-%m-%d"), 60)
systematic = tier("D", "2018-01-01", 86400)          # a daily position is held over calendar days
# One REFERENCE point: HFT colocated - typical published figures, not retail-measurable.
hft = (1e-3, 5e4)                                     # ~1 ms holds, tens of thousands of trades/day

pts = [("HFT (colocated)\nmicroseconds-ms", hft, "#dc2626"),
       ("Intraday algo\n(1m EMA cross)", intraday, "#7c83ff"),
       ("Systematic\n(daily trend)", systematic, "#16a34a")]

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8.5, 5.5))
xs = np.array([p[1][0] for p in pts])
ax.plot(xs, 1.0 / xs * 86400, color="#9a9a9a", lw=1, ls="--", alpha=0.6,
        label="trades/day ~ 1 / holding")
for label, (hold, tpd), col in pts:
    ax.scatter(hold, tpd, s=170, color=col, edgecolor="#222", zorder=5)
    ax.annotate(label, (hold, tpd), textcoords="offset points", xytext=(12, 10),
                fontsize=10, fontweight="600", color=col)
ax.set_xscale("log")
ax.set_yscale("log")
ax.set_xlabel("typical holding period (seconds, log scale)")
ax.set_ylabel("trades per day (log scale)")
ax.set_title("The speed-horizon map: HFT, intraday algo and systematic")
ax.legend(loc="upper right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Intraday algo: hold ~{intraday[0] / 60:.0f} min, {intraday[1]:.1f} trades/day. "
      f"Systematic: hold ~{systematic[0] / 86400:.0f} days, {systematic[1]:.2f} trades/day. "
      f"HFT reference: hold ~1 ms, ~{hft[1]:,.0f} trades/day. Saved {out.name}")
