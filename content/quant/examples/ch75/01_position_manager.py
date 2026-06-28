# A tiny PMS: apply real fills to a position and track size, average price and realised P&L.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


class PositionManager:
    """Average-cost position book. qty > 0 is a buy fill, qty < 0 a sell fill."""

    def __init__(self):
        self.position = 0     # signed quantity held
        self.avg = 0.0        # average price of the open position
        self.realised = 0.0   # realised P&L in rupees

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
            new_pos = self.position + qty
            self.position = new_pos
            if new_pos == 0:
                self.avg = 0.0
            elif (new_pos > 0) != ((self.position - qty) > 0):
                self.avg = price   # position flipped: remainder opens at fill price


# Real fill prices: the closes of recent RELIANCE daily bars.
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=20)).strftime("%Y-%m-%d")
bars = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                      start_date=start, end_date=end)
px = [round(float(p), 2) for p in bars["close"].tail(6)]

# A build-and-unwind sequence applied at those real prices.
fills = [("BUY", 100), ("BUY", 100), ("SELL", 150), ("SELL", 50), ("BUY", 200), ("SELL", 200)]

pms = PositionManager()
print(f"{'#':>2} {'side':>4} {'qty':>4} {'price':>9} {'position':>9} {'avg':>9} {'realised':>11}")
for i, ((side, q), price) in enumerate(zip(fills, px), 1):
    pms.apply(q if side == "BUY" else -q, price)
    print(f"{i:>2} {side:>4} {q:>4} {price:>9.2f} {pms.position:>9d} {pms.avg:>9.2f} {pms.realised:>11.2f}")

last = px[-1]
unreal = pms.position * (last - pms.avg)
print(f"\nFinal position {pms.position} | realised P&L Rs {pms.realised:.2f} | "
      f"unrealised Rs {unreal:.2f} | total Rs {pms.realised + unreal:.2f}")
