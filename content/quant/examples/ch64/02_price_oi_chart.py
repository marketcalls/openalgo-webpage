# Plot a stock future's price against its open interest to read build-up and rollover.
import os
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

LOT = 500
df = client.history(symbol="RELIANCE28JUL26FUT", exchange="NFO", interval="D",
                    start_date="2026-06-01", end_date="2026-06-28")
df["oi_lots"] = df["oi"] / LOT

sns.set_theme(style="whitegrid")
fig, ax1 = plt.subplots(figsize=(9, 4.8))

ax2 = ax1.twinx()
ax2.bar(df.index, df["oi_lots"], width=0.8, color="#c9ccff", label="Open interest")
ax2.grid(False)
ax1.plot(df.index, df["close"], color="#7c83ff", lw=2, label="Close")

ax1.set_zorder(ax2.get_zorder() + 1)
ax1.patch.set_visible(False)
ax1.set_ylabel("Price (Rs)")
ax2.set_ylabel("Open interest (lots)")
ax1.set_title("RELIANCE 28-Jul-26 future: price vs open interest")

peak = df["oi_lots"].idxmax()
ax1.annotate("rollover build-up", xy=(peak, df.loc[peak, "close"]),
             xytext=(-95, 28), textcoords="offset points",
             color="#16a34a", fontsize=9, fontweight="bold",
             arrowprops=dict(arrowstyle="->", color="#16a34a"))

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

oi_chg = (df["oi_lots"].iloc[-1] / df["oi_lots"].iloc[0] - 1) * 100
print(f"OI rose {oi_chg:+.0f}% over the window to {df['oi_lots'].iloc[-1]:,.0f} lots "
      f"while price went {df['close'].iloc[0]:.0f} -> {df['close'].iloc[-1]:.0f}. Saved {out.name}")
