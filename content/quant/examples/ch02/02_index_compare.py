# Same market, different stories: rebase three indices to 100 and watch them diverge.
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

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
for sym, label, color in [("NIFTY", "Nifty 50", "#7c83ff"),
                          ("BANKNIFTY", "Bank Nifty", "#16a34a"),
                          ("NIFTYIT", "Nifty IT", "#e0852b")]:
    df = client.history(symbol=sym, exchange="NSE_INDEX", interval="D",
                        start_date=start, end_date=end)
    rebased = df["close"] / df["close"].iloc[0] * 100   # everyone starts at 100
    ax.plot(df.index, rebased, label=label, color=color, lw=1.6)
    print(f"{label:12s} 1-year return: {rebased.iloc[-1] - 100:+.1f}%")

ax.axhline(100, color="#9ca3af", ls="--", lw=1)
ax.set_title("One year, three indices - all rebased to 100")
ax.set_ylabel("Growth of 100 invested")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
