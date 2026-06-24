# Is the market a coin flip? Plot Nifty's daily returns against a normal curve.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api
from scipy import stats

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date=start, end_date=end)
rets = df["close"].pct_change().dropna()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.histplot(rets, bins=40, stat="density", color="#7c83ff", edgecolor="none", ax=ax)
x = np.linspace(rets.min(), rets.max(), 200)
ax.plot(x, stats.norm.pdf(x, rets.mean(), rets.std()), color="#16a34a", lw=2,
        label="the 'coin flip' normal curve")
ax.set_title("NIFTY daily returns vs a normal distribution")
ax.set_xlabel("Daily return")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Excess kurtosis:", round(float(stats.kurtosis(rets)), 2), "(0 = normal; >0 = fat tails)")
print("Saved", out.name, "from", len(rets), "days")
