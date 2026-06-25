# Python's four everyday data types, one per piece of a trade.
quantity = 50            # int   - a whole number
price = 1313.60          # float - a number with a decimal point
symbol = "RELIANCE"      # str   - text, always in quotes
is_market_open = True    # bool  - either True or False

# type() tells you what kind of value something is.
print(quantity, "->", type(quantity))
print(price, "->", type(price))
print(symbol, "->", type(symbol))
print(is_market_open, "->", type(is_market_open))
