# Replay the reconstructed book and plot best bid, best ask and the spread per event.
import random
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

random.seed(7)  # pinned for a reproducible deterministic replay


class OrderBook:
    """Same price-time-priority book as example 01, rebuilt from events."""

    def __init__(self):
        self.orders = {}
        self.seq = 0

    def add(self, oid, side, price, qty):
        self.seq += 1
        self.orders[oid] = {"side": side, "price": price, "qty": qty, "seq": self.seq}

    def modify(self, oid, price=None, qty=None):
        o = self.orders[oid]
        if price is not None and price != o["price"]:
            o["price"] = price
            self.seq += 1
            o["seq"] = self.seq
        if qty is not None:
            o["qty"] = qty

    def cancel(self, oid):
        self.orders.pop(oid, None)

    def trade(self, side, qty):
        opp = "S" if side == "B" else "B"
        resting = [o for o in self.orders.values() if o["side"] == opp]
        resting.sort(key=lambda o: (o["price"], o["seq"]) if side == "B"
                     else (-o["price"], o["seq"]))
        left = qty
        for o in resting:
            if left <= 0:
                break
            take = min(o["qty"], left)
            o["qty"] -= take
            left -= take
        self.orders = {k: v for k, v in self.orders.items() if v["qty"] > 0}

    def top(self):
        bids, asks = {}, {}
        for o in self.orders.values():
            lv = bids if o["side"] == "B" else asks
            lv[o["price"]] = lv.get(o["price"], 0) + o["qty"]
        bb = max(bids) if bids else None
        ba = min(asks) if asks else None
        return bb, ba


TAPE = [
    ("add", "b1", "B", 811.95, 500), ("add", "a1", "S", 812.15, 400),
    ("add", "b2", "B", 812.00, 300), ("add", "a2", "S", 812.05, 250),
    ("add", "a3", "S", 812.10, 600), ("modify", "b2", None, 700),
    ("trade", "B", 200), ("add", "a4", "S", 812.05, 150),
    ("trade", "B", 200), ("cancel", "a1"),
    ("add", "b3", "B", 812.05, 400), ("trade", "S", 300),
    ("trade", "S", 100), ("cancel", "b1"),
    ("add", "a5", "S", 812.05, 350), ("trade", "B", 700),
]

book = OrderBook()
steps, bids, asks, spreads = [], [], [], []
for i, ev in enumerate(TAPE, 1):
    kind = ev[0]
    if kind == "add":
        book.add(ev[1], ev[2], ev[3], ev[4])
    elif kind == "modify":
        book.modify(ev[1], ev[2], ev[3])
    elif kind == "cancel":
        book.cancel(ev[1])
    else:
        book.trade(ev[1], ev[2])
    bb, ba = book.top()
    if bb is None or ba is None:
        continue
    steps.append(i)
    bids.append(bb)
    asks.append(ba)
    spreads.append(round(ba - bb, 2))

sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8.5, 5.4), sharex=True,
                               gridspec_kw={"height_ratios": [2, 1]})
ax1.step(steps, asks, where="post", color="#dc2626", label="Best ask", linewidth=1.8)
ax1.step(steps, bids, where="post", color="#16a34a", label="Best bid", linewidth=1.8)
ax1.fill_between(steps, bids, asks, step="post", color="#7c83ff", alpha=0.12)
ax1.set_ylabel("Price")
ax1.set_title("Reconstructed top of book replayed event by event (synthetic tape)")
ax1.legend(loc="upper left")
ax2.step(steps, spreads, where="post", color="#7c83ff", linewidth=1.8)
ax2.fill_between(steps, 0, spreads, step="post", color="#7c83ff", alpha=0.15)
ax2.set_ylabel("Spread")
ax2.set_xlabel("Event number on the tape")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Replayed {len(TAPE)} events; spread moved between {min(spreads):.2f} and "
      f"{max(spreads):.2f}, best ask {asks[0]:.2f} -> {asks[-1]:.2f}. Saved {out.name}")
