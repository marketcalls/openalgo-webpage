# A short-squeeze candidate: a sharp up-move on a surge of volume (forced covering).
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

SYMBOL = "SBIN"
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=220)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange="NSE", interval="D", start_date=start, end_date=end)

df["ret"] = df["close"].pct_change()
peak = df["ret"].idxmax()
volx = df["volume"] / df["volume"].median()

sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 5.2), sharex=True, gridspec_kw={"height_ratios": [2.6, 1]})
ax1.plot(df.index, df["close"], color="#7c83ff", lw=1.7)
ax1.scatter([peak], [df.loc[peak, "close"]], color="#dc2626", s=70, zorder=5,
            label=f"+{df.loc[peak, 'ret'] * 100:.1f}% on {peak.date()}")
ax1.set_ylabel("Price (Rs)")
ax1.set_title(f"{SYMBOL} - sharp up-move on a volume surge (squeeze candidate)")
ax1.legend(loc="upper left")

colors = ["#dc2626" if v >= 2 else "#9aa0aa" for v in volx]
ax2.bar(df.index, df["volume"] / 1e6, color=colors, width=1.0)
ax2.set_ylabel("Volume (M)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{SYMBOL} jumped {df.loc[peak, 'ret'] * 100:.1f}% on {peak.date()} at {volx.loc[peak]:.1f}x median volume - a classic short-squeeze signature. Saved {out.name}")
