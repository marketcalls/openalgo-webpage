# Plot the rolling 1-year out-of-sample hit rate of a momentum signal decaying toward the coin-flip line.
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
close = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date="2015-01-01", end_date=end)["close"].astype(float)

ret = close.pct_change()
sig = np.sign(close.rolling(20).mean() - close.rolling(50).mean()).shift(1)
df = pd.DataFrame({"ret": ret, "sig": sig}).dropna()
df = df[df.sig != 0]

hit = (np.sign(df.ret) == df.sig).astype(int)
roll = hit.rolling(252).mean()                 # rolling 1-year directional hit rate
ins_level = hit.iloc[:int(len(df) * 0.65)].mean()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(10, 4.6))
ax.plot(roll.index, roll * 100, color="#7c83ff", lw=1.6, label="rolling 1-year hit rate")
ax.axhline(50, color="#dc2626", ls="--", lw=1.3, label="coin flip (50%)")
ax.axhline(ins_level * 100, color="#16a34a", ls=":", lw=1.3, label=f"early edge ({ins_level*100:.1f}%)")
ax.fill_between(roll.index, 50, roll * 100, where=(roll * 100 >= 50), color="#16a34a", alpha=0.08)
ax.fill_between(roll.index, 50, roll * 100, where=(roll * 100 < 50), color="#dc2626", alpha=0.08)
ax.set_title("NIFTY 20/50 momentum sign: the edge bleeds back to a coin flip")
ax.set_ylabel("directional hit rate (%)")
ax.set_ylim(38, 70)
ax.legend(loc="upper right", fontsize=9)

fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Rolling hit rate fell from a {roll.max()*100:.1f}% peak to {roll.dropna().iloc[-1]*100:.1f}% recently "
      f"(coin flip is 50%). Saved {out.name}")
