# Your latency has a shape - plot it, and see how far it is from HFT speed.
import os
import time
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

latencies = []
for _ in range(40):
    t0 = time.perf_counter()
    client.quotes(symbol="RELIANCE", exchange="NSE")
    latencies.append((time.perf_counter() - t0) * 1000)
    time.sleep(0.6)        # space calls out so rate limits don't skew the timing

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.histplot(latencies, bins=25, color="#7c83ff", edgecolor="none", ax=ax)
med = sorted(latencies)[len(latencies) // 2]
ax.axvline(med, color="#16a34a", lw=1.6, label=f"your median {med:.1f} ms")
ax.axvline(0.01, color="#dc2626", lw=1.6, ls="--", label="HFT colocated ~0.01 ms")
ax.set_title("Your round-trip latency vs HFT speed")
ax.set_xlabel("Round-trip latency (milliseconds)")
ax.set_ylabel("Count")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Median {med:.1f} ms - roughly {med / 0.01:,.0f}x slower than a colocated HFT engine. Saved {out.name}")
