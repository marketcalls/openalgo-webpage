# A grab-bag of popular NumPy functions you'll use on price data.
import numpy as np

closes = np.array([1305.0, 1298.5, 1310.4, 1318.6, 1312.7])

print("diff    :", np.diff(closes))               # day-to-day change
print("abs     :", np.abs(np.diff(closes)))       # size of move, sign dropped
print("round   :", np.round(closes, 0))           # round to whole rupees
print("sqrt    :", np.round(np.sqrt(closes), 1))
print("maximum :", np.maximum(closes, 1310))      # floor each value at 1310
print("sort    :", np.sort(closes))               # ascending
print("unique  :", np.unique([5, 5, 10, 20, 20])) # distinct values, sorted
