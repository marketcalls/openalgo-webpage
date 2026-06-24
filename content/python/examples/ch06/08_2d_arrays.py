# A 2D array is a table: here three stocks (rows) over four days (columns).
import numpy as np

# rows = RELIANCE, TCS, INFY ; columns = Mon..Thu closes
prices = np.array([
    [1305.0, 1298.5, 1310.4, 1312.7],
    [2068.0, 2090.5, 2075.0, 2081.25],
    [1052.0, 1041.3, 1055.8, 1048.5],
])

print("shape        :", prices.shape)        # (3, 4) -> 3 rows, 4 columns
print("INFY row     :", prices[2])           # the third stock
print("Thu column   :", prices[:, -1])       # last day, every stock
print("Per-stock avg:", np.round(prices.mean(axis=1), 1))  # across each row
print("Per-day avg  :", np.round(prices.mean(axis=0), 1))  # down each column
print("Reshaped     :", np.arange(6).reshape(2, 3))
