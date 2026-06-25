import numpy as np

# 1D - a single row of values (one stock's prices).
oned = np.array([101.2, 103.5, 102.8])
print("1D:", oned, "| shape", oned.shape, "| ndim", oned.ndim)
print()

# 2D - a table: 3 days (rows) x 2 stocks (columns).
twod = np.array([
    [101.2, 250.1],
    [103.5, 248.7],
    [102.8, 252.3],
])
print("2D:\n", twod)
print("shape", twod.shape, "| ndim", twod.ndim)   # (3 rows, 2 columns)
print()

# 3D - a stack of tables (e.g. 2 weeks, each a 3-day x 2-stock table).
threed = np.arange(12).reshape(2, 3, 2)
print("3D shape:", threed.shape, "| ndim", threed.ndim)   # (2, 3, 2)
