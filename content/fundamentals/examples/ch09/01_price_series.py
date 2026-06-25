# A list holds many values in order, written inside square brackets.
closes = [101.2, 103.5, 102.8, 104.1, 105.6, 104.9, 106.3]   # a week of closes

print("All closes   :", closes)
print("How many     :", len(closes))
print("First (Mon)  :", closes[0])     # same indexing rules as strings
print("Last (today) :", closes[-1])
print("First three  :", closes[:3])    # a slice - Mon, Tue, Wed
print("Last two     :", closes[-2:])
