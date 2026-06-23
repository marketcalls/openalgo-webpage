# A hand-built candlestick chart -- one rectangle and wick per session.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=40)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end).tail(20)

fig, ax = plt.subplots(figsize=(9, 4.5))
for i, (_, row) in enumerate(df.iterrows()):
    up = row["close"] >= row["open"]
    colour = "#2ea043" if up else "#cf222e"          # green up day, red down day
    ax.plot([i, i], [row["low"], row["high"]], color=colour, linewidth=1)        # the wick
    lo, hi = sorted([row["open"], row["close"]])
    ax.bar(i, hi - lo, bottom=lo, width=0.6, color=colour)                       # the body

ax.set_title("TCS candlesticks (last 20 sessions)")
ax.set_xticks(range(0, len(df), 4))
ax.set_xticklabels([d.strftime("%d-%b") for d in df.index[::4]])
ax.grid(True, axis="y", alpha=0.3)

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
