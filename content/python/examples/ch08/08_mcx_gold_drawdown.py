# An MCX commodity chart: GOLDM price with its drawdown shaded beneath.
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
start = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%d")
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)
x = list(range(len(df)))

df["dd"] = (df["close"] / df["close"].cummax() - 1) * 100   # % below the running peak

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6), sharex=True,
                               gridspec_kw={"height_ratios": [2, 1]})
ax1.plot(x, df["close"], color="#d29922", linewidth=1.6)
ax1.set_title("GOLDM (MCX) price and drawdown")
ax1.set_ylabel("Price")
ax1.grid(True, alpha=0.3)

ax2.fill_between(x, df["dd"], 0, color="#cf222e", alpha=0.4)
ax2.set_ylabel("Drawdown %")
ax2.grid(True, alpha=0.3)

step = max(1, len(df) // 8)
ax2.set_xticks(x[::step])
ax2.set_xticklabels(df.index[::step].strftime("%d %b"), rotation=45, ha="right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name, "| deepest drawdown", round(df["dd"].min(), 2), "%")
