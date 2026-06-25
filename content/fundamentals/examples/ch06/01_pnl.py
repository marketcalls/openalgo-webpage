# The four everyday arithmetic operators, on a real trade.
buy_price = 1300.00
sell_price = 1313.60
quantity = 50

profit_per_share = sell_price - buy_price                 # subtraction
total_profit = profit_per_share * quantity                # multiplication
pct_change = (sell_price - buy_price) / buy_price * 100    # division, then x100

print("Profit per share:", round(profit_per_share, 2))
print("Total profit    :", round(total_profit, 2))
print("Percentage change:", round(pct_change, 2), "%")
