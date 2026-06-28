# Plot price with triple-barrier outcomes (up barrier, down barrier, time barrier) for sample events.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date="2024-06-01", end_date=end)
c, h, l = df["close"], df["high"], df["low"]
vol = pd.Series(ta.stdev(c.pct_change().fillna(0.0), 20), index=df.index)

PT, SL, H = 2.0, 2.0, 10
cv, hv, lv, vv = c.values, h.values, l.values, vol.values
idx = df.index


def label_event(i):
    up, dn = cv[i] * (1 + PT * vv[i]), cv[i] * (1 - SL * vv[i])
    for j in range(i + 1, i + H + 1):
        if hv[j] >= up:
            return up, dn, 1, j, up
        if lv[j] <= dn:
            return up, dn, -1, j, dn
    return up, dn, 0, i + H, cv[i + H]


# Pick one well-separated event of each outcome so the figure shows all three barrier types.
n = len(c)
events, last, seen = [], -99, set()
for i in range(20, n - H):
    if np.isnan(vv[i]) or vv[i] == 0.0:
        continue
    out = label_event(i)[2]
    if out not in seen and i - last >= H + 4:
        events.append(i); seen.add(out); last = i
    if len(seen) == 3:
        break
events.sort()
colors = {1: "#16a34a", -1: "#dc2626", 0: "#7c83ff"}
mk = {1: "^", -1: "v", 0: "s"}

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.8))
ax.plot(idx, c, color="#444", lw=1.1, label="RELIANCE close")
counts = {1: 0, -1: 0, 0: 0}
for i in events:
    up, dn, out, j, tp = label_event(i)
    counts[out] += 1
    x0, x1 = idx[i], idx[i + H]
    ax.hlines(up, x0, x1, color="#16a34a", lw=1.2, ls="--", alpha=0.8)
    ax.hlines(dn, x0, x1, color="#dc2626", lw=1.2, ls="--", alpha=0.8)
    ax.vlines(x1, dn, up, color="#9a9a9a", lw=1.1, ls=":")
    ax.plot(idx[i], cv[i], "o", color="#111", ms=4)            # entry
    ax.plot(idx[j], tp, mk[out], color=colors[out], ms=10, mec="#111", mew=0.6)

ax.set_xlim(idx[max(0, events[0] - 6)], idx[min(n - 1, events[-1] + H + 6)])
ax.set_title("Triple-barrier outcomes on RELIANCE  (profit-take ^, stop v, time-barrier [])")
ax.set_ylabel("Price (Rs)")
ax.legend(loc="upper left", fontsize=9)
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"SUMMARY: {len(events)} events plotted - "
      f"{counts[1]} profit-take, {counts[-1]} stop, {counts[0]} time-barrier. Saved {out.name}")
