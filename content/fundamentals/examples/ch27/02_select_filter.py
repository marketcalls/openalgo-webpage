import yfinance as yf

df = yf.Ticker("AAPL").history(period="3mo")[["Open", "Close", "Volume"]].round(2)
df.index = df.index.date

# One column is a Series; pick it with df["Close"].
print("Close column (last 3):")
print(df["Close"].tail(3))
print()

# Add a NEW column, computed from existing ones (open-to-close change).
df["Chg%"] = ((df["Close"] - df["Open"]) / df["Open"] * 100).round(2)

# Filter rows: keep only days that gained more than 2% from open to close.
big_up = df[df["Chg%"] > 2]
print("Days up more than 2% (open to close):")
print(big_up[["Close", "Chg%"]])
