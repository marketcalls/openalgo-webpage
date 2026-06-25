import numpy as np

prices = np.array([101.2, 103.5, 99.8, 104.1, 98.5, 106.3])

# Aggregations collapse an array into a single answer.
print("sum     :", round(prices.sum(), 1))
print("cumsum  :", prices.cumsum().round(1))           # running total
print("argmax  :", prices.argmax(), "(index of the highest price)")
print("median  :", np.median(prices))
print("90th pct:", round(np.percentile(prices, 90), 2))

# Boolean masking - keep only the elements that pass a test.
print("above 100:", prices[prices > 100])
print("how many :", int((prices > 100).sum()))

# np.where picks between two values element by element.
labels = np.where(prices > 100, "up", "down")
print("labels   :", labels)

# np.diff = each value minus the previous one (day-to-day change).
print("diffs    :", np.diff(prices).round(1))
