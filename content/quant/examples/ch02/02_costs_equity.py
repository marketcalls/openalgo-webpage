# The developer/trader's job: take the SAME signal and see if it survives real round-trip costs.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2015-01-01", end_date=end)

close = df["close"]
fast, slow = ta.sma(close, 20), ta.sma(close, 100)

# Position decided at close (1 = long, 0 = flat), held the next day.
pos = (fast > slow).astype(float).shift(1).fillna(0.0)
ret = close.pct_change().fillna(0.0)

one_way = 0.0005                       # 5 bps each side: brokerage + STT + slippage (10 bps round trip)
turn = pos.diff().abs().fillna(0.0)    # 1.0 on every entry or exit
cost = turn * one_way

gross = (1 + pos * ret).cumprod()
net = (1 + pos * ret - cost).cumprod()
hold = (1 + ret).cumprod()
trips = int(turn.sum() / 2)

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(10, 5.5))
ax.plot(df.index, gross, color="#7c83ff", lw=1.8, label="Strategy gross")
ax.plot(df.index, net, color="#dc2626", lw=1.8, label=f"Strategy net of {one_way*2*1e4:.0f} bps round trip")
ax.plot(df.index, hold, color="#9a9a9a", lw=1.2, ls="--", label="Buy & hold NIFTY")
ax.set_title("Same signal, two jobs: research vs the cost of trading it (NIFTY 20/100 SMA)")
ax.set_ylabel("Growth of 1 rupee")
ax.legend(loc="upper left")
fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

print(f"{trips} round-trip trades over {len(close)} days. "
      f"Final wealth -> gross {gross.iloc[-1]:.2f}x, net {net.iloc[-1]:.2f}x, buy&hold {hold.iloc[-1]:.2f}x. "
      f"Costs ate {(gross.iloc[-1] - net.iloc[-1]):.2f}x. Saved {out.name}")
