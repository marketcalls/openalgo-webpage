import yfinance as yf

# The headline indices, by their Yahoo Finance symbols (^ marks an index).
indices = {
    "Nifty 50 (NSE)": "^NSEI",
    "Sensex (BSE)":   "^BSESN",
    "S&P 500 (US)":   "^GSPC",
    "Nasdaq (US)":    "^IXIC",
}

for name, symbol in indices.items():
    close = yf.Ticker(symbol).history(period="5d")["Close"].dropna()
    last = float(close.iloc[-1])
    chg = (close.iloc[-1] / close.iloc[-2] - 1) * 100
    print(f"{name:16} {last:>12,.2f}  ({chg:+.2f}%)")
