# The equity curve: what buy-and-hold would have done to your capital.
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
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
x = list(range(len(df)))

rets = df["close"].pct_change().fillna(0)
growth = (1 + rets).cumprod().values          # 1.0 at the start; compounds each day

fig, ax = plt.subplots(figsize=(9, 4.5))
ax.plot(x, growth, color="#2ea043", linewidth=1.8)
ax.axhline(1.0, color="#8b949e", linestyle="--")     # break-even line
ax.fill_between(x, 1.0, growth, where=growth >= 1.0, color="#2ea043", alpha=0.15)
ax.set_title(f"RELIANCE buy-and-hold growth of 1 ({(growth[-1]-1)*100:.1f}%)")
ax.set_ylabel("Growth multiple")
ax.grid(True, alpha=0.3)

step = max(1, len(df) // 8)
ax.set_xticks(x[::step])
ax.set_xticklabels(df.index[::step].strftime("%d %b"), rotation=45, ha="right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
