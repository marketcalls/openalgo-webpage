import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
ret = df["Close"].pct_change() * 100

# Split the returns by weekday, then average each group - all in one line.
by_weekday = ret.groupby(df.index.day_name()).mean().round(3)

# Put the days back into calendar order for a tidy table.
order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
print("Average daily return by weekday (%):")
print(by_weekday.reindex(order))
