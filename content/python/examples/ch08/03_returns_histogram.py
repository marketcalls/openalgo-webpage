# A histogram shows how daily returns are spread -- the shape of risk.
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
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")
df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

rets = df["close"].pct_change().dropna() * 100   # daily returns in percent

fig, ax = plt.subplots(figsize=(8, 4.5))
ax.hist(rets, bins=30, color="#1f6feb", edgecolor="white")
ax.axvline(0, color="#8b949e", linestyle="--")          # the break-even line
ax.axvline(rets.mean(), color="#d29922", label=f"mean {rets.mean():.2f}%")
ax.set_title("INFY daily return distribution")
ax.set_xlabel("Daily return (%)")
ax.set_ylabel("Number of days")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name, "from", len(rets), "days")
