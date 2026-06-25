# A string is a sequence of characters - reach in by position with [ ].
symbol = "RELIANCE"

print("First letter:", symbol[0])     # R  - counting starts at 0
print("Last letter :", symbol[-1])    # E  - negative counts from the end
print("First three :", symbol[:3])    # REL - a "slice" from start up to 3
print("Length      :", len(symbol))   # 8  - how many characters

# Slicing is a quick way to pull pieces out of a date string.
date = "2026-06-25"
print("Year :", date[:4])             # 2026
print("Month:", date[5:7])            # 06
print("Day  :", date[8:])             # 25
