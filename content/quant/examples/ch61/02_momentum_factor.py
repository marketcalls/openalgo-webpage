# A momentum factor: do last year's winners keep winning? Rank, then check next year.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=730)).strftime("%Y-%m-%d")
universe = ["RELIANCE", "INFY", "HDFCBANK", "ITC", "TATASTEEL", "ADANIENT", "SBIN",
            "BHARTIARTL", "MARUTI", "SUNPHARMA", "TITAN", "HINDALCO"]

rows = []
for sym in universe:
    c = client.history(symbol=sym, exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]
    mid = len(c) // 2
    rows.append({"stock": sym,
                 "formation": c.iloc[mid] / c.iloc[0] - 1,      # year 1 return (the signal)
                 "holding": c.iloc[-1] / c.iloc[mid] - 1})       # year 2 return (the test)

df = pd.DataFrame(rows).sort_values("formation")
half = len(df) // 2
low, high = df.head(half)["holding"].mean(), df.tail(half)["holding"].mean()

print(f"Low-momentum group, next-year return : {low * 100:+.1f}%")
print(f"High-momentum group, next-year return: {high * 100:+.1f}%")
print(f"Momentum long-short spread           : {(high - low) * 100:+.1f}%")

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.regplot(data=df, x="formation", y="holding", ax=ax,
            scatter_kws={"s": 50, "color": "#7c83ff"}, line_kws={"color": "#dc2626"})
ax.set_title("Momentum: last year's return vs next year's (positive slope = momentum works)")
ax.set_xlabel("Formation: year-1 return")
ax.set_ylabel("Holding: year-2 return")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Saved {out.name}")
