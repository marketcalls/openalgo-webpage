# A conflated snapshot (1m closes) draws far less travel than the intra-bar path.
import os
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

SYMBOL, EXCHANGE = "RELIANCE", "NSE"
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="1m",
                    start_date="2026-06-20", end_date="2026-06-27")

# Use the most recent trading day, first 60 minutes (the liveliest stretch).
last = sorted(set(df.index.date))[-1]
day = df[df.index.date == last].head(60)

# Conflated snapshot: one print per minute, the close. This is all a snapshot feed
# would deliver. Dense proxy: walk open -> high -> low -> close inside each bar,
# a stand-in for the ticks the snapshot threw away.
snap_x, snap_y = [], []
dense_x, dense_y = [], []
for i, (_, bar) in enumerate(day.iterrows()):
    dense_x += [i, i + 0.25, i + 0.5, i + 0.75]
    dense_y += [bar.open, bar.high, bar.low, bar.close]
    snap_x.append(i + 0.75)
    snap_y.append(bar.close)

snap_len = sum(abs(snap_y[j] - snap_y[j - 1]) for j in range(1, len(snap_y)))
dense_len = sum(abs(dense_y[j] - dense_y[j - 1]) for j in range(1, len(dense_y)))

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.5))
ax.plot(dense_x, dense_y, color="#9a9a9a", lw=1.0, alpha=0.9,
        label=f"intra-bar proxy (O-H-L-C), travel {dense_len:.0f} pts")
ax.plot(snap_x, snap_y, color="#7c83ff", lw=1.8, marker="o", ms=4,
        label=f"conflated snapshot (1m close), travel {snap_len:.0f} pts")
ax.set_title(f"{SYMBOL} {last} - a snapshot hides the intra-bar path")
ax.set_xlabel("minute of session")
ax.set_ylabel("price")
ax.legend(loc="best", framealpha=0.9)

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{SYMBOL} {last}, 60x 1m bars: close-only snapshot travelled {snap_len:.1f} pts; "
      f"intra-bar proxy travelled {dense_len:.1f} pts ({dense_len/snap_len:.1f}x). Saved {out.name}")
