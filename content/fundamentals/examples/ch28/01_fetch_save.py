import yfinance as yf

# ".NS" is Yahoo Finance's suffix for NSE-listed Indian stocks.
df = yf.Ticker("RELIANCE.NS").history(period="6mo")[["Open", "High", "Low", "Close", "Volume"]]
df = df.round(2).dropna()          # drop incomplete rows (Yahoo leaves today's bar empty)
df.index = df.index.date
df.index.name = "Date"

# Save the whole table to a CSV file - just one line.
df.to_csv("reliance_6mo.csv")
print("Saved", len(df), "rows to reliance_6mo.csv")
print(df.tail(3))
