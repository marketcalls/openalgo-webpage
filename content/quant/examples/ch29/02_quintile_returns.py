# Sort stocks into groups by momentum, then check each group's next-month return.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
universe = ["RELIANCE", "INFY", "HDFCBANK", "ITC", "TATASTEEL", "ADANIENT", "SBIN",
            "BHARTIARTL", "MARUTI", "SUNPHARMA", "TITAN", "HINDALCO", "AXISBANK",
            "LT", "WIPRO", "POWERGRID"]

prices = pd.DataFrame({s: client.history(symbol=s, exchange="NSE", interval="D",
                                         start_date="2021-01-01", end_date=end)["close"]
                       for s in universe})
monthly = prices.resample("ME").last()
momentum = monthly.pct_change(6)
forward = monthly.pct_change().shift(-1)

GROUPS = 4
bucket_ret = {g: [] for g in range(GROUPS)}
for date in momentum.index:
    score = momentum.loc[date].dropna()
    if len(score) < GROUPS:
        continue
    ranks = score.rank()
    labels = pd.qcut(ranks, GROUPS, labels=False)
    for g in range(GROUPS):
        names = labels[labels == g].index
        bucket_ret[g].append(forward.loc[date, names].mean())

avg = [np.nanmean(bucket_ret[g]) * 100 for g in range(GROUPS)]
names = ["Q1\n(losers)", "Q2", "Q3", "Q4\n(winners)"]

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.barplot(x=names, y=avg, hue=names, legend=False, palette="viridis", ax=ax)
ax.axhline(0, color="#555", lw=1)
ax.set_title("Next-month return by momentum group (monotonic rise = momentum works)")
ax.set_ylabel("Avg next-month return (%)")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Group returns (low->high momentum): {[round(float(a), 2) for a in avg]}. Saved {out.name}")
