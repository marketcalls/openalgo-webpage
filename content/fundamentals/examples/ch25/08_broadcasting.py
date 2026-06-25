import numpy as np

prices = np.array([
    [101.2, 250.1],
    [103.5, 248.7],
    [102.8, 252.3],
])

# Scalar broadcasting: one number "stretches" to every element.
print("all prices + 1%:\n", (prices * 1.01).round(2))
print()

# Array broadcasting: a row of 2 values lines up with the 2 columns.
fee = np.array([0.5, 1.0])                 # a different fee per stock
print("minus a per-stock fee:\n", (prices - fee).round(2))
print()

# axis=0 works DOWN the columns: subtract each column's own mean (centre it).
col_means = prices.mean(axis=0)            # one mean per column
print("column means       :", col_means.round(2))
print("each value - its column mean:\n", (prices - col_means).round(2))
