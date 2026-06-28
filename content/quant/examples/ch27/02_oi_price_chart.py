# Watch price and open interest together - where conviction builds and where it leaves.
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

SYMBOL, EXCHANGE = "NIFTY30JUN26FUT", "NFO"
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="D", start_date=start, end_date=end)

sns.set_theme(style="whitegrid")
fig, ax1 = plt.subplots(figsize=(8, 4.5))
ax1.plot(df.index, df["close"], color="#7c83ff", lw=2, label="Price (close)")
ax1.set_ylabel("Price", color="#7c83ff")
ax1.tick_params(axis="y", labelcolor="#7c83ff")

ax2 = ax1.twinx()
ax2.fill_between(df.index, df["oi"] / 1e6, color="#16a34a", alpha=0.18)
ax2.plot(df.index, df["oi"] / 1e6, color="#16a34a", lw=1.5, label="Open interest (M)")
ax2.set_ylabel("Open interest (million)", color="#16a34a")
ax2.tick_params(axis="y", labelcolor="#16a34a")
ax2.grid(False)

ax1.set_title(f"{SYMBOL} - price vs open interest")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"OI moved {df['oi'].iloc[0] / 1e6:.1f}M -> {df['oi'].iloc[-1] / 1e6:.1f}M as expiry nears. Saved {out.name}")
