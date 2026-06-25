import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
ret = (df["Close"].pct_change() * 100).dropna()

# Group by calendar month, then summarise each group with SEVERAL functions at once.
summary = ret.groupby(ret.index.to_period("M")).agg(["mean", "std", "min", "max"]).round(2)
summary.index = summary.index.strftime("%Y-%m")

print("Monthly return statistics (%):")
print(summary)
