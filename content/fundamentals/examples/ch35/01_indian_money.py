def indian_format(n):
    """Format a whole number with Indian 2-2-3 digit grouping (lakh/crore style)."""
    s = f"{int(round(n)):d}"
    if len(s) <= 3:
        return s
    last3, rest = s[-3:], s[:-3]
    parts = []
    while len(rest) > 2:                 # group the rest in twos, from the right
        parts.insert(0, rest[-2:])
        rest = rest[:-2]
    if rest:
        parts.insert(0, rest)
    return ",".join(parts) + "," + last3

# The same numbers, Western grouping vs Indian grouping.
for n in [1313, 656800, 18016237, 1500000000]:
    print(f"Western {n:>14,}   ->   Indian Rs {indian_format(n)}")
