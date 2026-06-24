# The underwater chart: drawdown shows the depth and duration of real pain.
import os
from datetime import datetime
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

end = datetime.now().strftime("%Y-%m-%d")
close = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date="2019-01-01", end_date=end)["close"]

equity = close / close.iloc[0]
drawdown = (equity / equity.cummax() - 1) * 100        # % below the running peak

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.fill_between(drawdown.index, drawdown, 0, color="#dc2626", alpha=0.3)
ax.plot(drawdown.index, drawdown, color="#dc2626", lw=1)
worst = drawdown.min()
ax.axhline(worst, color="#7c83ff", ls="--", lw=1.2, label=f"max drawdown {worst:.1f}%")
ax.set_title("NIFTY underwater chart - every dip below the previous peak")
ax.set_ylabel("Drawdown (%)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Max drawdown since 2019: {worst:.1f}% (the COVID crash). Saved {out.name}")
