# A module is simply a .py file of functions you can import elsewhere.
# Save this as tradetools.py, then import it from another script.
def pnl(buy, sell, qty):
    """Profit on a completed round-trip trade."""
    return (sell - buy) * qty


def pct_change(old, new):
    """Percentage change from old price to new."""
    return (new - old) / old * 100
