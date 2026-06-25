import numpy as np

# 10 recent daily closes for AAPL (real data), stored as a NumPy array.
closes = np.array([291.58, 295.63, 291.13, 296.42, 299.24,
                   295.95, 298.01, 297.01, 294.30, 293.08])

print("Array     :", closes)
print("Count     :", closes.size)
print("Mean      :", round(closes.mean(), 2))   # stats are built right in
print("Std dev   :", round(closes.std(), 2))
print("Min / Max :", closes.min(), "/", closes.max())
