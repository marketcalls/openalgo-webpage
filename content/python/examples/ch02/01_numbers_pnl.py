# Python numbers do your trade math. Compute the P&L of a single trade.
entry_price = 1300.0
exit_price = 1345.5
quantity = 50

pnl = (exit_price - entry_price) * quantity
pnl_pct = (exit_price - entry_price) / entry_price * 100

print("Profit/Loss:", round(pnl, 2))
print("Return %   :", round(pnl_pct, 2))
