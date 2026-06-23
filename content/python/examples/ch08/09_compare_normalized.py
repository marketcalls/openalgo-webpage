# Compare two stocks fairly by rebasing both to 100 on day one.
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
start = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%d")


def rebased(sym):
    d = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    return d["close"] / d["close"].iloc[0] * 100      # everyone starts at 100

series = {sym: rebased(sym) for sym in ["TCS", "INFY"]}
idx = next(iter(series.values())).index
x = list(range(len(idx)))

fig, ax = plt.subplots(figsize=(9, 4.5))
for (sym, s), colour in zip(series.items(), ["#1f6feb", "#d29922"]):
    ax.plot(x, s.values, label=sym, color=colour, linewidth=1.6)

ax.axhline(100, color="#8b949e", linestyle="--")
ax.set_title("TCS vs INFY relative performance (rebased to 100)")
ax.set_ylabel("Index (start = 100)")
ax.legend()
ax.grid(True, alpha=0.3)

step = max(1, len(idx) // 8)
ax.set_xticks(x[::step])
ax.set_xticklabels(idx[::step].strftime("%d %b"), rotation=45, ha="right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
