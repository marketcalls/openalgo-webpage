# Vectorisation: do the math on the WHOLE array at once -- no loops.
import numpy as np

closes = np.array([1305.0, 1298.5, 1310.4, 1318.6, 1312.7])

# Broadcasting: combine an array with a single number.
print("After 5% rise :", np.round(closes * 1.05, 2))
print("Minus 10 rs   :", closes - 10)

# Two arrays, multiplied element by element: price x quantity held.
qty = np.array([10, 10, 20, 20, 15])
value = closes * qty
print("Holding value :", value)
print("Total value   :", value.sum())
