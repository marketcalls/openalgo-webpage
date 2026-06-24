# NumPy basics for traders -- everything starts with creating an array.
import numpy as np

# An array from a Python list: five daily closes of RELIANCE (in rupees).
closes = np.array([1305.0, 1298.5, 1310.4, 1318.6, 1312.7])
print("From a list :", closes)

# Handy ready-made arrays:
print("arange      :", np.arange(1, 6))           # 1..5, like range()
print("zeros       :", np.zeros(5))               # five 0.0s (empty P&L slots)
print("ones        :", np.ones(3))                # three 1.0s
print("full        :", np.full(4, 100))           # four 100s (e.g. lot sizes)
print("linspace    :", np.linspace(100, 200, 5))  # 5 evenly spaced, 100 to 200
