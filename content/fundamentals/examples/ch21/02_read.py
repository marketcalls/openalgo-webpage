# Reading a file back: open it in "r" (read) mode - the default.
with open("watchlist.txt", "r") as f:
    content = f.read()                # the whole file as one big string
print("--- whole file ---")
print(content)

# More often you loop line by line, parsing as you go.
print("--- parsed ---")
with open("watchlist.txt") as f:      # "r" is assumed if you omit the mode
    for line in f:
        symbol, price = line.strip().split(",")
        print(f"{symbol:10} {float(price):>9.2f}")
