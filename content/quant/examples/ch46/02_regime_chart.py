# See the regimes: Nifty's trend line, with turbulent (high-vol) stretches shaded.
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
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2019-01-01", end_date=end)
df["sma200"] = df["close"].rolling(200).mean()
df["vol20"] = df["close"].pct_change().rolling(20).std() * (252 ** 0.5) * 100
df = df.dropna()
turbulent = df["vol20"] > df["vol20"].median()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(df.index, df["close"], color="#7c83ff", lw=1.2, label="NIFTY")
ax.plot(df.index, df["sma200"], color="#888", lw=1.3, ls="--", label="200-day trend")
ax.fill_between(df.index, df["close"].min(), df["close"].max(),
                where=turbulent, color="#dc2626", alpha=0.12, label="turbulent (high vol)")
ax.set_title("NIFTY regimes - trend (line) and turbulence (shaded)")
ax.set_ylabel("Price")
ax.legend(loc="upper left")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"{int(turbulent.sum())} of {len(df)} days were turbulent. Today {'turbulent' if turbulent.iloc[-1] else 'calm'}. Saved {out.name}")
