import numpy as np
import pandas as pd

df = pd.DataFrame({
    "Date":  ["2026-06-23", "2026-06-24", "2026-06-25"],
    "Close": [1309.5, 1313.6, np.nan],
})

# Option A: drop the incomplete row entirely.
print("dropna() - remove rows with gaps:")
print(df.dropna())
print()

# Option B: fill the gap. ffill carries the last known value forward.
print("ffill() - carry the last value forward:")
print(df.ffill())
