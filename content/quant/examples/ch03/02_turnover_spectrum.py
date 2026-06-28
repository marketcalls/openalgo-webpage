# The holding-period spectrum: how often three styles flip position per year on NIFTY.
import os
from datetime import datetime
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
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2021-01-01", end_date=end)
c = df["close"]
years = len(c) / 252.0

# Three position rules, fast to slow.
fast = np.sign(c.pct_change()).fillna(0)                       # flip with daily direction (prop/HFT proxy)
medium = np.where(ta.sma(c, 20) > ta.sma(c, 100), 1.0, -1.0)   # 20/100 SMA trend (systematic fund)
medium = np.nan_to_num(medium)
hold = np.ones(len(c))                                         # buy-and-hold (long-only investor)

def flips_per_year(pos):
    pos = np.asarray(pos, dtype=float)
    return int((np.diff(pos) != 0).sum()) / years

styles = {"Prop / HFT\n(daily flip)": flips_per_year(fast),
          "Systematic fund\n(20/100 trend)": flips_per_year(medium),
          "Long-only investor\n(buy & hold)": flips_per_year(hold)}

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 5))
bars = ax.bar(list(styles), list(styles.values()),
              color=["#dc2626", "#7c83ff", "#16a34a"])
ax.set_yscale("symlog")
ax.set_ylabel("Position flips per year (turnover)")
ax.set_title(f"NIFTY {c.index[0].date()} to {c.index[-1].date()}: the holding-period spectrum")
for b, v in zip(bars, styles.values()):
    ax.text(b.get_x() + b.get_width() / 2, v + 0.3, f"{v:.0f}/yr", ha="center", fontweight="600")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
f_fast, f_trend, f_hold = list(styles.values())
print(f"{len(c)} NIFTY days ({years:.1f} yrs). Flips/yr -> "
      f"fast {f_fast:.0f}, trend {f_trend:.0f}, hold {f_hold:.0f}. Saved {out.name}")
