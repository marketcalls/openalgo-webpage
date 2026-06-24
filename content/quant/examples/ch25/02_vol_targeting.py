# Volatility targeting: scale exposure so risk stays steady - down in storms, up in calm.
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
                    start_date="2021-01-01", end_date=end)
r = df["close"].pct_change()

TARGET = 12.0                                            # target annualised volatility, %
realized = r.rolling(20).std() * (252 ** 0.5) * 100      # recent realised vol
exposure = (TARGET / realized).clip(upper=2.5)           # scale, capped at 2.5x leverage
exposure = exposure.dropna()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(exposure.index, exposure, color="#7c83ff", lw=1.4)
ax.axhline(1.0, color="#888", ls="--", lw=1, label="full exposure")
ax.fill_between(exposure.index, exposure, 1.0, where=exposure < 1, color="#dc2626", alpha=0.18)
ax.fill_between(exposure.index, exposure, 1.0, where=exposure > 1, color="#16a34a", alpha=0.18)
ax.set_title(f"Volatility targeting ({TARGET:.0f}% target) - exposure shrinks in turbulent times")
ax.set_ylabel("Position size (x capital)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Exposure ranges {exposure.min():.2f}x (storms) to {exposure.max():.2f}x (calm), now {exposure.iloc[-1]:.2f}x. Saved {out.name}")
