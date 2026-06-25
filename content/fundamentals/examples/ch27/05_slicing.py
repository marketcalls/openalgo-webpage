import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)

# .iloc = by POSITION (end excluded). Two slices: [rows, columns].
print("first 2 rows, by position:")
print(df.iloc[0:2, 0:4])          # rows 0-1, columns 0-3 (Open..Close)
print()

# .loc = by LABEL (end included). Slice a date range AND a column range.
print("a date range, columns Open..Close, by label:")
print(df.loc["2026-06-22":"2026-06-24", "Open":"Close"])
