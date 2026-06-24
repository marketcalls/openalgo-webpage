# Every array knows its own shape, size and data type.
import numpy as np

closes = np.array([1305.0, 1298.5, 1310.4, 1318.6, 1312.7])

print("Array    :", closes)
print("shape    :", closes.shape)    # (5,) -> 5 elements in one row
print("ndim     :", closes.ndim)     # 1  -> one dimension
print("size     :", closes.size)     # 5  -> total count
print("dtype    :", closes.dtype)    # float64 -> decimal numbers

qty = np.array([10, 25, 15])
print("int dtype:", qty.dtype)       # int64 -> whole numbers (e.g. quantities)
