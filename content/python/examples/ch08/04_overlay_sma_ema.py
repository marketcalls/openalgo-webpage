# Overlay a 20-day SMA and a 20-day EMA on price, using openalgo.ta.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)
x = list(range(len(df)))

df["sma20"] = ta.sma(df["close"], 20)   # simple average, equal weight
df["ema20"] = ta.ema(df["close"], 20)   # exponential, reacts faster to new prices

fig, ax = plt.subplots(figsize=(9, 4.5))
ax.plot(x, df["close"], color="#8b949e", linewidth=1, label="Close")
ax.plot(x, df["sma20"], color="#1f6feb", linewidth=1.6, label="SMA 20")
ax.plot(x, df["ema20"], color="#d29922", linewidth=1.6, label="EMA 20")
ax.set_title("HDFCBANK with SMA and EMA")
ax.legend()
ax.grid(True, alpha=0.3)

step = max(1, len(df) // 8)
ax.set_xticks(x[::step])
ax.set_xticklabels(df.index[::step].strftime("%d %b"), rotation=45, ha="right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
