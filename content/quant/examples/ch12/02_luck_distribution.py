# The distribution of luck: 1000 noise strategies, and the lucky tail that fools you.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2021-01-01", end_date=end)["close"].pct_change().dropna().values

rng = np.random.default_rng(0)
N, days = 1000, len(r)
sharpes = np.array([(s * r).mean() / (s * r).std() * np.sqrt(252)
                    for s in (rng.choice([1, -1], size=days) for _ in range(N))])

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.histplot(sharpes, bins=40, color="#7c83ff", edgecolor="none", ax=ax)
ax.axvline(0, color="#555", lw=1)
ax.axvline(sharpes.max(), color="#dc2626", lw=1.8, label=f"luckiest = {sharpes.max():.2f} Sharpe")
ax.axvspan(1.0, sharpes.max() + 0.1, color="#dc2626", alpha=0.08)
ax.set_title("1000 random (zero-edge) strategies - and the lucky tail")
ax.set_xlabel("Annualised Sharpe ratio")
ax.set_ylabel("Number of strategies")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{(sharpes > 1).sum()} of {N} noise strategies cleared a 'great' Sharpe of 1.0 - by chance alone. Saved {out.name}")
