# The summary functions a trader reaches for every day.
import numpy as np

closes = np.array([1305.0, 1298.5, 1310.4, 1318.6, 1312.7])

print("mean   :", round(closes.mean(), 2))    # average close
print("max    :", closes.max())               # highest
print("min    :", closes.min())               # lowest
print("std    :", round(closes.std(), 2))     # spread -- a volatility proxy
print("median :", np.median(closes))
print("sum    :", closes.sum())
print("cumsum :", np.cumsum(closes))          # running total
