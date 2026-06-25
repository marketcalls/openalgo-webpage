# Dictionaries can hold dictionaries - here, a watchlist keyed by symbol.
watchlist = {
    "RELIANCE": {"ltp": 1313.60, "change": 13.60},
    "TCS":      {"ltp": 2109.00, "change": -8.50},
    "INFY":     {"ltp": 1056.60, "change": 4.20},
}

print("TCS price:", watchlist["TCS"]["ltp"])    # dig in with two keys
print("Symbols  :", list(watchlist.keys()))     # all the keys as a list

# Loop through every quote in the watchlist.
for symbol, data in watchlist.items():
    print(f"{symbol:9} ltp {data['ltp']:>9.2f}  change {data['change']:+.2f}")
