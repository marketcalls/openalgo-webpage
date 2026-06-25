# Import your own module exactly like a built-in one (no ".py" in the name).
import tradetools

print("P&L      :", round(tradetools.pnl(1300, 1313.60, 50), 2))
print("Change % :", round(tradetools.pct_change(1300, 1313.60), 2))
