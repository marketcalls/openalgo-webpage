# The square-root law: impact grows with the square root of participation (order / ADV).
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

SYMBOL, EXCHANGE = "RELIANCE", "NSE"
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="D", start_date=start, end_date=end)

adv = df["volume"].tail(20).mean()                  # average daily volume, shares (real)
price = float(df["close"].iloc[-1])                 # latest close (real)
sigma_bps = df["close"].pct_change().std() * 1e4    # daily volatility in bps (real)
Y = 0.5                                             # calibration constant (square-root prefactor)

# Impact curve: cost(bps) = Y * sigma * sqrt(participation), participation = order / ADV.
part = np.logspace(-5, np.log10(0.30), 200)         # 0.001% to 30% of ADV
impact_bps = Y * sigma_bps * np.sqrt(part)

# A realistic active-retail order in rupees, expressed as a fraction of ADV.
retail_rs = 10_00_000
retail_part = (retail_rs / price) / adv
retail_impact = Y * sigma_bps * np.sqrt(retail_part)
inst_impact = Y * sigma_bps * np.sqrt(0.05)         # an institutional 5%-of-ADV order

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(part * 100, impact_bps, color="#7c83ff", lw=2, label="square-root impact")
ax.scatter([retail_part * 100], [retail_impact], color="#16a34a", zorder=5,
           label=f"Rs 10L retail ({retail_part * 100:.4f}% ADV)")
ax.axvline(5, color="#dc2626", ls="--", lw=1.2, label="5% ADV (institutional)")
ax.set_xscale("log")
ax.set_title(f"{SYMBOL} - square-root impact (sigma {sigma_bps:.0f} bps/day, ADV {adv / 1e6:.1f}M sh)")
ax.set_xlabel("Order size as % of ADV (log scale)")
ax.set_ylabel("Estimated impact (bps)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"ADV {adv / 1e6:.1f}M sh, sigma {sigma_bps:.0f} bps/day. "
      f"Rs 10L retail = {retail_part * 100:.4f}% ADV -> ~{retail_impact:.2f} bps; "
      f"5% ADV -> ~{inst_impact:.0f} bps. Saved {out.name}")
