# A taste of things to come - run this in VS Code by pressing the Run button.
# We take a week of closing prices and work out the average.
prices = [101.2, 103.5, 102.8, 104.1, 105.6]   # five daily closes

average = sum(prices) / len(prices)             # add them up, divide by how many

print("Five closing prices:", prices)
print(f"Average close this week: {average:.2f}")
