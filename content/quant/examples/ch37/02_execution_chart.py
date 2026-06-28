# Intraday price with its VWAP - the line a good execution algo tries to match.
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
start = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="5m",
                    start_date=start, end_date=end)
df = df[df.index.date == df.index[-1].date()].copy()

df["typical"] = (df["high"] + df["low"] + df["close"]) / 3
df["vwap"] = (df["typical"] * df["volume"]).cumsum() / df["volume"].cumsum()

sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6), sharex=True,
                               gridspec_kw={"height_ratios": [3, 1]})
ax1.plot(range(len(df)), df["close"], color="#7c83ff", lw=1.3, label="price")
ax1.plot(range(len(df)), df["vwap"], color="#dc2626", lw=2, label="running VWAP")
ax1.set_title(f"RELIANCE intraday vs VWAP ({df.index[-1].date()})")
ax1.set_ylabel("Price")
ax1.legend()
ax2.bar(range(len(df)), df["volume"], color="#16a34a", alpha=0.5)
ax2.set_ylabel("Volume")
ax2.set_xlabel("5-minute bar of the day")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Final VWAP {df['vwap'].iloc[-1]:.2f}, close {df['close'].iloc[-1]:.2f}. Saved {out.name}")
