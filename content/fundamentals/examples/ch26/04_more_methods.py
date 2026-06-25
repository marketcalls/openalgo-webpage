import pandas as pd

closes = pd.Series([101.2, 103.5, 99.8, 104.1, 98.5, 106.3],
                   index=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], name="close")

# Running and lagged calculations.
print("running max   :", list(closes.cummax()))
print("day-on-day diff:", list(closes.diff().round(1)))
print("3-day average :", list(closes.rolling(3).mean().round(2)))

# Filtering and ranking.
print("above 100     :", list(closes[closes > 100]))
print("top 2 closes  :", list(closes.nlargest(2)))
print("between 99-104 :", list(closes[closes.between(99, 104)]))

# Transform each value with apply, then count the categories with value_counts.
direction = closes.diff().dropna().apply(lambda x: "up" if x > 0 else "down")
print("directions    :", list(direction))
print("up/down counts:", direction.value_counts().to_dict())
