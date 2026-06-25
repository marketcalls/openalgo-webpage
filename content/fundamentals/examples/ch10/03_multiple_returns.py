# Some built-ins hand back several values at once - bundled as a tuple.
shares = 250
per_lot = 75
lots, leftover = divmod(shares, per_lot)   # divmod returns (quotient, remainder)
print("Full lots:", lots, " Leftover shares:", leftover)

# min() and max() work on a tuple exactly as they do on a list.
day = (1318.4, 1297.2, 1313.6)
print("Day high:", max(day), " Day low:", min(day))
