import yfinance as yf

# yfinance returns a DataFrame: rows are dates, columns are Open/High/Low/Close/Volume.
df = yf.Ticker("AAPL").history(period="6mo")
df = df[["Open", "High", "Low", "Close", "Volume"]].round(2)
df.index = df.index.date           # tidy the date index for display

print("Shape   :", df.shape)        # (rows, columns)
print("Columns :", list(df.columns))
print()
print("First 3 rows:")
print(df.head(3))
