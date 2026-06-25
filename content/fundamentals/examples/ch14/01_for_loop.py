closes = [101.2, 103.5, 102.8, 104.1, 105.6]

# A for loop visits each item in the list, one at a time.
total = 0.0
for price in closes:
    total += price            # accumulate a running sum
print("Sum of closes:", round(total, 2))
print("Average      :", round(total / len(closes), 2))

# enumerate() hands you the position AND the value together.
for day, price in enumerate(closes, start=1):
    print(f"Day {day}: {price}")
