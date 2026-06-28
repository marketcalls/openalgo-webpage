# In F&O you trade fixed LOTS, not single shares. Contract value = price x lot size.
# (Lot sizes are illustrative - exchanges revise them periodically.)
lots = {"NIFTY": 65, "BANKNIFTY": 30, "RELIANCE": 500, "TCS": 175}
prices = {"NIFTY": 24021.65, "BANKNIFTY": 52000.00, "RELIANCE": 1313.60, "TCS": 2109.00}

print(f"{'Symbol':<12}{'Lot':>6}{'Price':>12}{'Contract value':>18}")
print("-" * 48)
for sym, lot in lots.items():
    value = lot * prices[sym]
    print(f"{sym:<12}{lot:>6}{prices[sym]:>12,.2f}{value:>18,.2f}")
