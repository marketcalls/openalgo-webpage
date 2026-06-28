# Footprints in volume: marking the days large participants showed up in RELIANCE.
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
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date=start, end_date=end)

vol = df["volume"]
close = df["close"]
med = vol.rolling(20, min_periods=10).median()      # a participant-neutral baseline
spike = vol > 2 * med                                # days big money likely stepped in

sns.set_theme(style="whitegrid")
fig, (axp, axv) = plt.subplots(2, 1, figsize=(10, 7), sharex=True,
                               gridspec_kw={"height_ratios": [2, 1]})

axp.plot(df.index, close, color="#7c83ff", lw=1.4)
axp.scatter(df.index[spike], close[spike], color="#dc2626", s=40, zorder=5, label="volume spike")
axp.set_title("RELIANCE daily close - red dots mark unusually high-volume days")
axp.set_ylabel("Close (Rs)")
axp.legend(loc="upper left")

axv.bar(df.index, vol / 1e6, color="#9aa0b5", width=1.0)
axv.bar(df.index[spike], vol[spike] / 1e6, color="#dc2626", width=1.0)
axv.plot(df.index, med / 1e6, color="#16a34a", lw=1.2, label="20-day median volume")
axv.set_ylabel("Volume (mn)")
axv.legend(loc="upper left")

fig.suptitle("Who moved the price? High-volume days as participant footprints", fontsize=13)
fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

big = vol.nlargest(1)
print(f"{len(df)} days, {int(spike.sum())} volume-spike days (>2x 20d median). "
      f"Biggest: {big.index[0].date()} at {int(big.iloc[0]/1e6)}mn shares on a "
      f"{close.pct_change().loc[big.index[0]]*100:+.2f}% day. Saved {out.name}")
