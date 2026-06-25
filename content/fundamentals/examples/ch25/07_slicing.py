import numpy as np

prices = np.array([
    [101.2, 250.1],   # day 0:  [stock A, stock B]
    [103.5, 248.7],   # day 1
    [102.8, 252.3],   # day 2
    [104.1, 255.0],   # day 3
])

# 1D slicing is exactly the list slicing from Chapter 8.
col_a = prices[:, 0]                       # every row, column 0 -> stock A's prices
print("Stock A (a column):", col_a)
print("First two of A    :", col_a[:2])    # plain [start:stop] slice

# 2D slicing: [rows, columns], separated by a comma. ":" means "all".
print("one cell [1, 0]   :", prices[1, 0])      # row 1, column 0
print("one row  [0, :]   :", prices[0, :])      # row 0, every column
print("one col  [:, 1]   :", prices[:, 1])      # every row, column 1
print("a block  [1:3, :] :\n", prices[1:3, :])  # rows 1-2, all columns
