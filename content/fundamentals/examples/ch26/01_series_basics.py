import pandas as pd

# A Series is values PLUS an index (labels). Here, closes labelled by weekday.
closes = pd.Series(
    [291.58, 295.63, 291.13, 296.42, 299.24],
    index=["Mon", "Tue", "Wed", "Thu", "Fri"],
    name="AAPL close",
)

print(closes)
print()
print("Wednesday  :", closes["Wed"])      # look up by label
print("Last value :", closes.iloc[-1])     # look up by position
print("Mean       :", round(closes.mean(), 2))
