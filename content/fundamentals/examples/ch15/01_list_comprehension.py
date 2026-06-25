symbols = ["RELIANCE", "TCS", "INFY", "HDFCBANK"]

# The long way: a loop that builds a new list item by item.
yahoo = []
for s in symbols:
    yahoo.append(s + ".NS")

# The comprehension way: the exact same result, in one readable line.
yahoo_quick = [s + ".NS" for s in symbols]

print("Loop         :", yahoo)
print("Comprehension:", yahoo_quick)
print("Identical?   :", yahoo == yahoo_quick)
