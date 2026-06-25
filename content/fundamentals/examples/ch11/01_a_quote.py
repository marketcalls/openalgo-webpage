# A dictionary stores values you look up by NAME (a "key"), not by position.
quote = {
    "symbol": "RELIANCE",
    "ltp": 1313.60,
    "change": 13.60,
    "volume": 4521000,
}

print("Symbol:", quote["symbol"])     # look up a value by its key
print("Price :", quote["ltp"])

quote["ltp"] = 1315.20                 # update an existing value
quote["high"] = 1318.40                # add a brand-new key
print("Updated:", quote)
