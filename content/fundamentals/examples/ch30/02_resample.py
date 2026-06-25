import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
close = df["Close"]

# Resample changes the time frame. "W" = weekly, "ME" = month-end.
weekly = close.resample("W").last()           # the last close of each week
monthly = close.resample("ME").agg(["first", "last", "max", "min"])

print("Daily points  :", close.size)
print("Weekly points :", weekly.size)
print()
print("Monthly summary (first / last / high / low):")
print(monthly.round(2).tail(4))
