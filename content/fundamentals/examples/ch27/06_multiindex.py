import yfinance as yf

# Ticker().history() gives SINGLE-level columns: Open, High, Low, Close, ...
hist = yf.Ticker("AAPL").history(period="5d")
print("history() columns :", list(hist.columns)[:5])
print("  hist['Close'] is a", type(hist["Close"]).__name__)
print()

# yf.download() gives a MULTI-INDEX: each column is a (field, ticker) pair.
dl = yf.download(["AAPL", "MSFT"], period="5d", progress=False)
print("download() columns:", list(dl.columns)[:4])
print("  dl['Close'] is a", type(dl["Close"]).__name__, "-> columns", list(dl["Close"].columns))
print("  one stock: dl['Close']['AAPL'].iloc[-1] =", round(float(dl["Close"]["AAPL"].dropna().iloc[-1]), 2))
