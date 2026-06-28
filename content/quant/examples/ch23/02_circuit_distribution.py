# How far in the tail does a 10% circuit sit? Plot 7 years of Nifty daily moves.
import os
from datetime import datetime
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
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2019-01-01", end_date=end)
r = df["close"].pct_change().dropna() * 100

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.histplot(r, bins=80, color="#7c83ff", edgecolor="none", ax=ax)
ax.axvline(-10, color="#dc2626", ls="--", lw=1.5, label="10% circuit")
ax.axvline(10, color="#dc2626", ls="--", lw=1.5)
worst = r.min()
ax.annotate(f"COVID, 23-Mar-2020\n{worst:.1f}%", xy=(worst, 2), xytext=(worst + 1.5, 60),
            color="#dc2626", fontsize=9, arrowprops=dict(arrowstyle="->", color="#dc2626"))
ax.set_title("NIFTY daily moves since 2019 - and the 10% circuit lines")
ax.set_xlabel("Daily move (%)")
ax.set_ylabel("Number of sessions")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Worst day {worst:.2f}%. Days beyond +/-10%: {(r.abs() >= 10).sum()}. Saved {out.name}")
