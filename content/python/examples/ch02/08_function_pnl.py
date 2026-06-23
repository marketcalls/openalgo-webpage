# A function can take inputs (with defaults) and return a computed result.
def trade_pnl(entry, exit_price, qty, side="BUY"):
    """P&L for a long (BUY) or short (SELL) trade."""
    move = exit_price - entry if side == "BUY" else entry - exit_price
    return round(move * qty, 2)


print("Long  :", trade_pnl(1300, 1345, 50))           # bought low, sold higher
print("Short :", trade_pnl(1300, 1280, 50, "SELL"))   # sold high, bought back lower
print("Loser :", trade_pnl(1300, 1290, 50))
