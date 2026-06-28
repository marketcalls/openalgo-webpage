# The settlement clock: a real-dated T+1 cycle versus the optional same-day T+0.
import os
from datetime import date
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

# Anchor on a real Friday so the weekend stretches T+1 to the next Monday.
trade_day = np.datetime64("2026-06-26")          # Friday 26 Jun 2026
t1 = np.busday_offset(trade_day, 1, roll="forward")  # next business day
fmt = lambda d: date.fromisoformat(str(d)).strftime("%a %d %b")

# A real price tag for the obligation that settles on T+1.
px = float(client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                          start_date="2026-06-20", end_date="2026-06-26")["close"].iloc[-1])

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(10, 4.2))
x0, x1 = 0, (np.datetime64(t1) - trade_day).astype(int)   # day offsets

# Standard rolling T+1 lane.
ax.hlines(1, x0, x1, color="#7c83ff", lw=3, zorder=1)
ax.scatter([x0, x1], [1, 1], s=120, color="#7c83ff", zorder=2)
ax.annotate("T  trade matched + novated\nmargin blocked upfront", (x0, 1),
            xytext=(x0, 1.28), ha="center", fontsize=9, color="#333")
ax.annotate(f"T+1  pay-in / pay-out\ndemat + funds settle\nRs {px:,.0f}/sh", (x1, 1),
            xytext=(x1, 1.28), ha="center", fontsize=9, color="#333")

# Optional same-day T+0 lane.
ax.hlines(0.4, x0, x0, color="#16a34a", lw=3)
ax.scatter([x0], [0.4], s=120, color="#16a34a", zorder=2)
ax.annotate("T+0  optional same-day\nsettlement (pilot set)", (x0, 0.4),
            xytext=(x0, 0.10), ha="center", fontsize=9, color="#16a34a")

ax.set_xticks([x0, x1])
ax.set_xticklabels([f"{fmt(trade_day)}\n(T)", f"{fmt(t1)}\n(T+1)"])
ax.set_yticks([0.4, 1]); ax.set_yticklabels(["T+0 path", "T+1 path"])
ax.set_ylim(-0.1, 1.65); ax.set_xlim(-0.4, x1 + 0.4)
ax.set_title("Indian equity settlement clock - a Friday trade settles the next Monday")
ax.grid(axis="y", visible=False)

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Trade {fmt(trade_day)} settles {fmt(t1)} under T+1 "
      f"({x1} calendar days later over the weekend); T+0 would settle same day. Saved {out.name}")
