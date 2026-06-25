import yfinance as yf

# A real month of Apple closes - yfinance hands back a pandas Series.
closes = yf.Ticker("AAPL").history(period="1mo")["Close"].round(2)
closes.index = closes.index.date          # tidy the timestamp index to plain dates

# pct_change(): daily returns in a single method call - made for this.
returns = closes.pct_change() * 100

print("Last 5 daily returns (%):")
print(returns.tail(5).round(2))
print()
print("Average daily return:", round(returns.mean(), 3), "%")
print("Biggest move (abs)  :", round(returns.abs().max(), 2), "%")
