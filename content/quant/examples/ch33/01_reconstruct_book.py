# Reconstruction demo: rebuild the top of book from a deterministic event tape.
# Events are SYNTHETIC, but the add/modify/cancel/trade replay logic is the real thing.
import random

random.seed(7)  # nothing random here, but pin the seed so the demo is reproducible


class OrderBook:
    """A tiny price-time-priority book rebuilt purely from events."""

    def __init__(self):
        self.orders = {}  # oid -> {side, price, qty, seq}
        self.seq = 0

    def add(self, oid, side, price, qty):
        self.seq += 1
        self.orders[oid] = {"side": side, "price": price, "qty": qty, "seq": self.seq}

    def modify(self, oid, price=None, qty=None):
        o = self.orders[oid]
        if price is not None and price != o["price"]:
            o["price"] = price            # a price change loses time priority
            self.seq += 1
            o["seq"] = self.seq
        if qty is not None:
            o["qty"] = qty

    def cancel(self, oid):
        self.orders.pop(oid, None)

    def trade(self, side, qty):
        # An aggressor of 'side' eats resting orders on the opposite side,
        # best price first, then earliest order (FIFO) at that price.
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
        return bb, (bids.get(bb, 0) if bb else 0), ba, (asks.get(ba, 0) if ba else 0)


# A hand-built deterministic tape, SBIN-like prices on a 0.05 paise tick.
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
print(f"{'step':>4} {'event':<22} {'bid':>8}{'x':>6} {'|':^3} {'ask':<8}{'x':<6} {'spread':>7}")
for i, ev in enumerate(TAPE, 1):
    kind = ev[0]
    if kind == "add":
        book.add(ev[1], ev[2], ev[3], ev[4])
        label = f"add {ev[1]} {ev[2]} {ev[3]:.2f}x{ev[4]}"
    elif kind == "modify":
        book.modify(ev[1], ev[2], ev[3])
        label = f"modify {ev[1]} qty->{ev[3]}"
    elif kind == "cancel":
        book.cancel(ev[1])
        label = f"cancel {ev[1]}"
    else:
        book.trade(ev[1], ev[2])
        label = f"trade {ev[1]} {ev[2]}"
    bb, bq, ba, aq = book.top()
    bbs = f"{bb:.2f}" if bb is not None else "-"
    bas = f"{ba:.2f}" if ba is not None else "-"
    spr = f"{ba - bb:.2f}" if (bb is not None and ba is not None) else "-"
    print(f"{i:>4} {label:<22} {bbs:>8}{bq:>6} {'|':^3} {bas:<8}{aq:<6} {spr:>7}")

bb, bq, ba, aq = book.top()
print(f"\nReconstruction demo: replayed {len(TAPE)} events; "
      f"final top of book bid {bb:.2f} x{bq} / ask {ba:.2f} x{aq}, spread {ba - bb:.2f}.")
