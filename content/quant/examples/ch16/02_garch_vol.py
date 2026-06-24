# GARCH's conditional volatility tracks the market's calm and storm.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from arch import arch_model
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2021-01-01", end_date=end)
r = df["close"].pct_change().dropna() * 100

res = arch_model(r, vol="Garch", p=1, q=1, mean="Constant").fit(disp="off")
ann_vol = res.conditional_volatility * (252 ** 0.5)        # annualised %

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.bar(r.index, r.abs() * (252 ** 0.5), color="#c7c9f5", width=2, label="|return| (annualised)")
ax.plot(r.index, ann_vol, color="#dc2626", lw=1.8, label="GARCH volatility")
ax.set_title("NIFTY - GARCH conditional volatility (annualised)")
ax.set_ylabel("Volatility (% annualised)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"GARCH vol ranges {ann_vol.min():.0f}%-{ann_vol.max():.0f}% over the period (now {ann_vol.iloc[-1]:.1f}%). Saved {out.name}")
