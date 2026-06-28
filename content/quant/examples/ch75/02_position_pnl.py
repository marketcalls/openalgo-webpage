# Chart the PMS state: position size and P&L (realised + total) evolving over the fill sequence.
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


class PositionManager:
    def __init__(self):
        self.position, self.avg, self.realised = 0, 0.0, 0.0

    def apply(self, qty, price):
        same_way = self.position == 0 or (self.position > 0) == (qty > 0)
        if same_way:
            new_pos = self.position + qty
            self.avg = (self.avg * self.position + price * qty) / new_pos
            self.position = new_pos
        else:
            closing = min(abs(qty), abs(self.position))
            direction = 1 if self.position > 0 else -1
            self.realised += closing * (price - self.avg) * direction
            prev = self.position
            self.position = self.position + qty
            if self.position == 0:
                self.avg = 0.0
            elif (self.position > 0) != (prev > 0):
                self.avg = price


end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=20)).strftime("%Y-%m-%d")
bars = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                      start_date=start, end_date=end)
px = [round(float(p), 2) for p in bars["close"].tail(6)]
fills = [("BUY", 100), ("BUY", 100), ("SELL", 150), ("SELL", 50), ("BUY", 200), ("SELL", 200)]

pms = PositionManager()
steps, pos, realised, total = [], [], [], []
for i, ((side, q), price) in enumerate(zip(fills, px), 1):
    pms.apply(q if side == "BUY" else -q, price)
    unreal = pms.position * (price - pms.avg)
    steps.append(i); pos.append(pms.position)
    realised.append(pms.realised); total.append(pms.realised + unreal)

sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6), sharex=True)
ax1.step(steps, pos, where="mid", color="#7c83ff", linewidth=2)
ax1.fill_between(steps, pos, step="mid", color="#7c83ff", alpha=0.15)
ax1.axhline(0, color="#888", linewidth=0.8)
ax1.set_ylabel("Position (shares)")
ax1.set_title("PMS state over the RELIANCE fill sequence")
ax2.plot(steps, realised, marker="o", color="#16a34a", label="realised P&L")
ax2.plot(steps, total, marker="s", color="#dc2626", linestyle="--", label="total (incl. unrealised)")
ax2.axhline(0, color="#888", linewidth=0.8)
ax2.set_ylabel("P&L (Rs)"); ax2.set_xlabel("Fill number"); ax2.legend()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Fills {len(fills)} | final position {pos[-1]} | realised Rs {realised[-1]:.2f} | "
      f"total Rs {total[-1]:.2f}. Saved {out.name}")
