symbols = ["RELIANCE", "TCS", "INFY"]
prices = [1313.60, 2109.00, 1056.60]

# zip() pairs the two lists; the dict comprehension builds {symbol: price}.
quotes = {sym: price for sym, price in zip(symbols, prices)}

print("Quotes:", quotes)
print("TCS   :", quotes["TCS"])
