import yfinance as yf

# The same company wears different "names" on different systems.
def to_yahoo(symbol, exchange="NSE"):
    """Turn a plain NSE/BSE symbol into its Yahoo Finance ticker."""
    suffix = {"NSE": ".NS", "BSE": ".BO"}.get(exchange, "")
    return symbol + suffix

print("RELIANCE on NSE ->", to_yahoo("RELIANCE", "NSE"))   # RELIANCE.NS
print("RELIANCE on BSE ->", to_yahoo("RELIANCE", "BSE"))   # RELIANCE.BO
print("AAPL (US)       ->", to_yahoo("AAPL", "US"))        # AAPL (no suffix)
print()

# Fetch the latest close for each, proving the mapped symbols really work.
for label, ysym in [("RELIANCE (NSE)", "RELIANCE.NS"), ("Apple (US)", "AAPL")]:
    close = yf.Ticker(ysym).history(period="5d")["Close"].dropna()
    print(f"{label:16} last close: {round(float(close.iloc[-1]), 2)}")
