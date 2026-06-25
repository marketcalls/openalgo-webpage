# Alignment and width turn ragged output into a clean, column-aligned table.
rows = [
    ("RELIANCE", 1313.60, 1.05),
    ("TCS", 2109.00, -0.52),
    ("INFY", 1056.60, 0.63),
]

# <  left-align   >  right-align   ^  centre   - then a width number.
print(f"{'Symbol':<10}{'LTP':>10}{'Chg%':>8}")
print("-" * 28)
for sym, ltp, chg in rows:
    print(f"{sym:<10}{ltp:>10.2f}{chg:>+8.2f}")

# A fill character goes before the alignment - here, pad with dots.
print()
print(f"{'TOTAL':.<20}{4479.20:>8.2f}")
