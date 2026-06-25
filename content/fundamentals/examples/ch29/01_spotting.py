import numpy as np
import pandas as pd

# A few Reliance closes - but the latest bar is incomplete (NaN), exactly what
# yfinance hands you for a trading day that has not closed yet.
df = pd.DataFrame({
    "Date":   ["2026-06-22", "2026-06-23", "2026-06-24", "2026-06-25"],
    "Close":  [1326.5, 1309.5, 1313.6, np.nan],
    "Volume": [12931213, 15400184, 11030917, np.nan],
})

print(df)
print()
print("Missing values per column:")
print(df.isna().sum())                          # isna() flags each gap
print("Rows with any gap:", df.isna().any(axis=1).sum())
