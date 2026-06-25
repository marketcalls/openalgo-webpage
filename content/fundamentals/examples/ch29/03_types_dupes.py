import pandas as pd

# A messier table: prices stored as TEXT, and a duplicated TCS row.
df = pd.DataFrame({
    "Symbol": ["RELIANCE", "TCS", "TCS", "INFY"],
    "Close":  ["1313.60", "2109.00", "2109.00", "1056.60"],   # note: text, not numbers
})

print("Close dtype before:", df["Close"].dtype)      # object = text

df["Close"] = df["Close"].astype(float)              # convert text -> numbers
print("Close dtype after :", df["Close"].dtype)      # float64

clean = df.drop_duplicates()                          # remove the repeated row
print()
print("After dropping duplicates:")
print(clean)
print("Total close value:", round(clean["Close"].sum(), 2))
