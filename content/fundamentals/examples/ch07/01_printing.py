# print() can take several values at once, separated by spaces by default.
symbol = "RELIANCE"
price = 1313.60
print("Symbol:", symbol, "Price:", price)

# sep= changes what goes BETWEEN values; end= changes how the line ENDS.
print("NSE", "RELIANCE", "1313.60", sep=" | ")
print("Loading", end="...")
print("done")

# Triple quotes make a multi-line block that prints exactly as written.
report = """--- Position ---
Symbol : RELIANCE
Shares : 50"""
print(report)
