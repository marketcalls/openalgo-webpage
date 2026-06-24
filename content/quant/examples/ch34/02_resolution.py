# Data volume explodes as you go finer - why quants need real time-series databases.
import os
from datetime import datetime, timedelta
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

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")

counts = {}
for iv in ["D", "1h", "15m", "5m", "1m"]:
    df = client.history(symbol="RELIANCE", exchange="NSE", interval=iv,
                        start_date=start, end_date=end)
    last_day = df.index[-1].date()
    counts[iv] = int((df.index.date == last_day).sum())            # bars on one day

for iv, n in counts.items():
    print(f"  {iv:4s}: {n:>4d} bars per day")
print("  tick : thousands of bars per day (every trade) - the finest resolution")

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.barplot(x=list(counts.keys()), y=list(counts.values()),
            hue=list(counts.keys()), legend=False, palette="viridis", ax=ax)
for i, n in enumerate(counts.values()):
    ax.text(i, n + 2, str(n), ha="center", fontsize=10)
ax.set_title("Bars per day by resolution - data explodes as you zoom in")
ax.set_ylabel("Bars in one trading day")
ax.set_xlabel("Interval")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"\nFrom {counts['D']} daily bar to {counts['1m']} one-minute bars - and tick is far more. Saved {out.name}")
