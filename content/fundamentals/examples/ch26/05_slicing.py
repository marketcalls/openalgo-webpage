import pandas as pd

s = pd.Series([101, 103, 100, 104, 99],
              index=["Mon", "Tue", "Wed", "Thu", "Fri"], name="close")

# Position slicing - exactly like a list: [start:stop], the stop is EXCLUDED.
print("first 3 by position  :", list(s.iloc[0:3]))        # Mon, Tue, Wed

# Label slicing with .loc - here the end label IS included (a pandas twist!).
print("Tue..Thu by label    :", list(s.loc["Tue":"Thu"]))  # Tue, Wed, Thu

# Boolean slicing - keep only the values that pass a test.
print("above 101 (boolean)  :", list(s[s > 101]))
