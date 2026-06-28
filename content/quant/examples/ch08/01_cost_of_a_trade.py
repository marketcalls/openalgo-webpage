# The real all-in cost of a trade under the Rs 20-per-order discount-broker model.
# Many Indian discount brokers follow this: a flat Rs 20 per executed order
# (equity delivery free). Rates are representative - verify the latest circulars.

EQ, OPT = (1000, 500), (100, 500)          # (price, qty): a Rs 1000 stock; a Rs 100 option


def breakdown(price, qty, *, brokerage, stt, exch_rate, stamp_rate):
    side = price * qty                      # value of one leg (buy = sell here)
    turnover = 2 * side
    exch = exch_rate * turnover
    sebi = 0.000001 * turnover              # Rs 10 per crore
    gst = 0.18 * (brokerage + exch + sebi)  # GST on brokerage + exchange + SEBI
    stamp = round(stamp_rate * side)        # on the buy side, to the nearest rupee
    total = brokerage + stt + exch + sebi + gst + stamp
    return total, qty


flat20 = lambda v: min(0.0003 * v, 20)      # Rs 20 or 0.03% per order, whichever is lower
eq_side, opt_side = EQ[0] * EQ[1], OPT[0] * OPT[1]

segments = {
    "Delivery equity": breakdown(*EQ, brokerage=0,                  stt=0.001 * eq_side * 2, exch_rate=0.0000307, stamp_rate=0.00015),
    "Intraday equity": breakdown(*EQ, brokerage=2 * flat20(eq_side), stt=0.00025 * eq_side,  exch_rate=0.0000307, stamp_rate=0.00003),
    "F&O futures":     breakdown(*EQ, brokerage=2 * flat20(eq_side), stt=0.0005 * eq_side,   exch_rate=0.0000183, stamp_rate=0.00002),
    "F&O options":     breakdown(*OPT, brokerage=2 * 20,            stt=0.0015 * opt_side,  exch_rate=0.0003553, stamp_rate=0.00003),
}

print(f"{'SEGMENT':18s}{'ALL-IN COST':>13s}{'BREAKEVEN (pts)':>18s}")
for name, (total, qty) in segments.items():
    print(f"{name:18s}{total:>13.2f}{total / qty:>18.2f}")
print("\nDelivery brokerage is ZERO, yet the trade still costs 1112 - STT alone is the giant.")
print("Flat Rs 20/order barely moves the needle; in India, STT dominates the bill.")
