import pandas as pd

# Read the CSV back into a DataFrame, using the Date column as the index.
df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)

print("Shape   :", df.shape)
print("Columns :", list(df.columns))
print()
print("Most recent rows:")
print(df.tail(3))
print()
print("Close-price summary:")
print(df["Close"].describe().round(2))
