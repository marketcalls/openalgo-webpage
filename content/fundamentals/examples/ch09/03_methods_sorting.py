# Built-in helpers turn a list of numbers into instant insight.
closes = [101.2, 103.5, 102.8, 104.1, 105.6, 104.9, 106.3]

print("Highest close:", max(closes))
print("Lowest close :", min(closes))
print("Average close:", round(sum(closes) / len(closes), 2))

# sorted() returns a NEW sorted list and leaves the original untouched.
print("Sorted (asc) :", sorted(closes))
print("Original kept:", closes)

# .sort() rearranges the list IN PLACE - it changes the original.
closes.sort(reverse=True)
print("Sorted (desc):", closes)
