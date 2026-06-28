# Capacity ceiling: gross alpha is fixed, but square-root impact grows with AUM, so net
# P&L rises, peaks, then falls. The peak is the strategy's capacity.
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

SYMBOL = "RELIANCE"
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange="NSE", interval="D", start_date=start, end_date=end)

adv = df["volume"].tail(20).mean()                 # average daily volume, shares (real)
price = float(df["close"].iloc[-1])                # latest close (real)
sigma_bps = df["close"].pct_change().std() * 1e4   # daily volatility in bps (real)

# Strategy assumptions (the alpha is the modeller's; the impact is calibrated on real data).
GROSS_BPS = 12.0          # gross edge per round trip, before impact
TRADES_YR = 120           # round trips per year (holding ~2 days)
Y = 0.5                   # square-root impact prefactor (see Chapter 26)

aum = np.linspace(1e6, 3e8, 600)                    # Rs 10 lakh to Rs 30 crore
part = (aum / price) / adv                          # participation: order / ADV per trade
impact_bps = 2 * Y * sigma_bps * np.sqrt(part)      # round-trip impact (enter and exit)
net_bps = GROSS_BPS - impact_bps
net_pnl = aum * TRADES_YR * net_bps / 1e4           # net rupees per year

i = int(np.argmax(net_pnl))
cap_aum, cap_pnl = aum[i], net_pnl[i]               # capacity = AUM that maximises net P&L
aum_cr, net_cr = aum / 1e7, net_pnl / 1e7

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(aum_cr, net_cr, color="#7c83ff", lw=2.4)
ax.fill_between(aum_cr, 0, net_cr, where=(net_pnl > 0), color="#16a34a", alpha=0.18)
ax.fill_between(aum_cr, 0, net_cr, where=(net_pnl <= 0), color="#dc2626", alpha=0.18)
ax.axhline(0, color="#555", lw=1)
ax.axvline(cap_aum / 1e7, color="#dc2626", ls=":", lw=1.6)
ax.scatter([cap_aum / 1e7], [cap_pnl / 1e7], color="#16a34a", zorder=5)
ax.annotate(f"capacity = Rs {cap_aum / 1e7:.0f} cr\npeak net P&L Rs {cap_pnl / 1e7:.2f} cr/yr",
            xy=(cap_aum / 1e7, cap_pnl / 1e7), xytext=(cap_aum / 1e7 + 5.5, cap_pnl / 1e7 * 0.45),
            fontsize=9, arrowprops=dict(arrowstyle="->", color="#16a34a"))
ax.set_title(f"{SYMBOL} capacity: {GROSS_BPS:.0f} bps gross edge eroded by square-root impact")
ax.set_xlabel("Capital deployed (Rs crore)")
ax.set_ylabel("Net P&L (Rs crore / year)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"ADV {adv / 1e6:.1f}M sh, sigma {sigma_bps:.0f} bps/day. Capacity ~ Rs {cap_aum / 1e7:.0f} cr "
      f"({part[i] * 100:.2f}% of ADV/trade), where impact has eaten {impact_bps[i]:.1f} of the "
      f"{GROSS_BPS:.0f} bps gross edge; peak net P&L ~ Rs {cap_pnl / 1e7:.2f} cr/yr. Saved {out.name}")
