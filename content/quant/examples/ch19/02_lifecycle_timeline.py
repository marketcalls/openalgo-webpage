# The order lifecycle as a state-machine timeline, from a small fill simulation.
import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

# The full state ladder of an exchange order; this run climbs the happy path.
LADDER = ["Rejected", "Cancelled", "Pending", "Open", "Partially filled", "Complete"]
ypos = {s: i for i, s in enumerate(LADDER)}

rng = np.random.default_rng(19)
QTY = 100                                   # a 100-share buy limit order
events = [(0.0, "Pending"), (0.4, "Open")]  # submitted, then acked and resting
t, filled = 0.4, 0
while filled < QTY:                          # liquidity arrives in random chunks
    t += float(rng.uniform(0.6, 1.4))
    filled = min(QTY, filled + int(rng.integers(20, 45)))
    events.append((round(t, 2), "Complete" if filled == QTY else "Partially filled"))

xs = [e[0] for e in events]
ys = [ypos[e[1]] for e in events]

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.step(xs, ys, where="post", color="#7c83ff", lw=2, zorder=2)
ax.scatter(xs, ys, color="#16a34a", s=60, zorder=3)
# Show the unrealised off-ramps every resting order faces.
ax.annotate("", xy=(0.4, ypos["Rejected"]), xytext=(0.0, ypos["Pending"]),
            arrowprops=dict(arrowstyle="->", color="#dc2626", ls="--", lw=1.2))
ax.annotate("", xy=(1.6, ypos["Cancelled"]), xytext=(0.4, ypos["Open"]),
            arrowprops=dict(arrowstyle="->", color="#dc2626", ls="--", lw=1.2))
ax.text(1.7, ypos["Cancelled"], " cancel / reject: terminal exits", va="center",
        color="#dc2626", fontsize=9)

ax.set_yticks(range(len(LADDER)))
ax.set_yticklabels(LADDER)
ax.set_xlabel("Seconds since submission")
ax.set_title(f"RELIANCE NSE  -  order lifecycle of a {QTY}-share buy limit")
ax.margins(x=0.05)

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Lifecycle: Pending -> Open -> Partially filled -> Complete in {xs[-1]:.2f}s, "
      f"{QTY}/{QTY} filled over {len(events) - 2} fills. Saved {out.name}")
