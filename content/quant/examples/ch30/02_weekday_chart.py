# Plot the day-of-week pattern in Nifty's average return - a calendar anomaly.
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
df["ret"] = df["close"].pct_change() * 100
df["weekday"] = df.index.day_name()

order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
mean_ret = df.groupby("weekday")["ret"].mean().reindex(order)

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
colors = ["#16a34a" if v >= 0 else "#dc2626" for v in mean_ret]
sns.barplot(x=order, y=mean_ret.values, hue=order, legend=False, palette=colors, ax=ax)
ax.axhline(0, color="#555", lw=1)
ax.set_title("NIFTY average return by weekday (2019-today)")
ax.set_ylabel("Average daily return (%)")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
best = mean_ret.idxmax()
print(f"Strongest weekday: {best} ({mean_ret.max():+.3f}%), weakest: {mean_ret.idxmin()} ({mean_ret.min():+.3f}%). Saved {out.name}")
