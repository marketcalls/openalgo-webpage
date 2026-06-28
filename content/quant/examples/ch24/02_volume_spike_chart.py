# Plot price and volume, mark candidate bulk/block days, and measure what price did next.
import os
from datetime import datetime, timedelta
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

SYMBOL, EXCHANGE, FWD = "SBIN", "NSE", 5
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=730)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="D",
                    start_date=start, end_date=end).reset_index(drop=True)

vol, close = df["volume"], df["close"]
med = vol.rolling(60, min_periods=30).median()
flag = vol > 3.0 * med                                # candidate bulk/block prints
fwd = close.shift(-FWD) / close - 1                    # return over the next FWD sessions

sns.set_theme(style="whitegrid")
fig, (axp, axv) = plt.subplots(2, 1, figsize=(10, 7), sharex=True,
                               gridspec_kw={"height_ratios": [2, 1]})
axp.plot(df.index, close, color="#7c83ff", lw=1.3)
axp.scatter(df.index[flag], close[flag], color="#dc2626", s=42, zorder=5,
            label="candidate bulk/block day")
axp.set_title(f"{SYMBOL} daily close - large prints and what price did next")
axp.set_ylabel("Close (Rs)")
axp.legend(loc="upper left")

axv.bar(df.index, vol / 1e6, color="#c7cad6", width=1.0)
axv.bar(df.index[flag], vol[flag] / 1e6, color="#dc2626", width=1.4)
axv.plot(df.index, 3 * med / 1e6, color="#16a34a", lw=1.1, label="3x 60-day median")
axv.set_ylabel("Volume (mn)")
axv.set_xlabel("Session number")
axv.legend(loc="upper left")
fig.tight_layout()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

after = fwd[flag].dropna()
base = fwd.dropna()
print(f"{int(flag.sum())} candidate days. Avg {FWD}-day forward return after a large print "
      f"{after.mean()*100:+.2f}% (median {after.median()*100:+.2f}%) vs all-day baseline "
      f"{base.mean()*100:+.2f}%. Saved {out.name}")
