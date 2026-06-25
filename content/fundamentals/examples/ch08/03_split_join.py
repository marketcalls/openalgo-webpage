# split() breaks text into a list; join() glues a list back into text.
line = "RELIANCE,TCS,INFY,HDFCBANK"
symbols = line.split(",")             # split on each comma

print("Symbols list:", symbols)
print("Count       :", len(symbols))
print("Third symbol:", symbols[2])    # INFY

# join() is split's mirror image - here with " | " between items.
print("Joined      :", " | ".join(symbols))

# Building a Yahoo Finance ticker by adding the .NS suffix (a taste of Chapter 34).
nse_symbol = "RELIANCE"
print("Yahoo ticker:", nse_symbol + ".NS")
