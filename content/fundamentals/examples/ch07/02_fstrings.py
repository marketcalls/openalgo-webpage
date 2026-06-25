# An f-string starts with the letter f and drops values straight into { }.
symbol = "RELIANCE"
qty = 50
price = 1313.60
buy = 1300.00

print(f"{symbol}: {qty} shares at {price}")

# After a colon comes a "format spec" that controls how a number looks.
print(f"Value      : {qty * price:,.2f}")          # thousands comma + 2 decimals
print(f"Change     : {price - buy:+.2f}")          # always show the + or - sign
print(f"Return     : {(price - buy) / buy:.2%}")   # display as a percentage
print(f"Price (0dp): {price:.0f}")                 # round to a whole number
