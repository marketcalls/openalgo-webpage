import numpy as np
import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)

# .iloc selects by POSITION; .loc selects by LABEL.
print("First close (iloc[0])      :", df.iloc[0]["Close"])
print("Close on a date (loc)      :", df.loc["2026-06-24", "Close"])
print()

# Add a computed column, and a conditional one with np.where.
df["Range"] = df["High"] - df["Low"]
df["Day"] = np.where(df["Close"] >= df["Open"], "up", "down")

# sort_values ranks the whole table; here, the widest-range days.
print("Top 3 widest-range days:")
print(df.sort_values("Range", ascending=False).head(3)[["Close", "Range", "Day"]].round(2))
print()

# Filter on MULTIPLE conditions: & = and, | = or, each wrapped in ( ).
strong = df[(df["Day"] == "up") & (df["Range"] > 40)]
print("Up days with range > 40    :", len(strong))
print("Highest close              :", df["Close"].max(), "on", df["Close"].idxmax().date())
