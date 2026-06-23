# Your first chart: a line of closing prices, saved as a PNG.
# We plot against an evenly-spaced position (0,1,2,...) and label ticks with dates,
# so non-trading days leave no gap.
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
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
x = list(range(len(df)))

fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(x, df["close"], color="#1f6feb", linewidth=1.6)
ax.set_title("RELIANCE daily close")
ax.set_ylabel("Price")
ax.grid(True, alpha=0.3)

step = max(1, len(df) // 8)
ax.set_xticks(x[::step])
ax.set_xticklabels(df.index[::step].strftime("%d %b"), rotation=45, ha="right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
