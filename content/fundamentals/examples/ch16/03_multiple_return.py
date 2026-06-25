def trade_summary(buy, sell, qty):
    """Return (profit, percent_change) for a completed round-trip trade."""
    profit = (sell - buy) * qty
    pct = (sell - buy) / buy * 100
    return profit, pct                  # two values come back as a tuple

# Unpack the two returned values straight into two names.
profit, pct = trade_summary(1300, 1313.60, 50)
print(f"Profit: {profit:,.2f}")
print(f"Move  : {pct:+.2f}%")
