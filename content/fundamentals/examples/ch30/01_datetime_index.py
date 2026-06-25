import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)

print("Index type:", type(df.index).__name__)        # DatetimeIndex
print("First date:", df.index[0].date(), " Last:", df.index[-1].date())
print()

# Select a whole month just by naming it - the datetime index makes this work.
may = df.loc["2026-05", "Close"]
print("May closes:", may.size, "days")
print("May range :", round(may.min(), 2), "to", round(may.max(), 2))
print()

# Or pick a date range with a slice.
window = df.loc["2026-06-01":"2026-06-10", "Close"]
print("Early June closes:")
print(window.round(2))
