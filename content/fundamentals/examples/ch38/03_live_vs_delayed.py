import os

import yfinance as yf
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Live: straight from the broker feed via OpenAlgo.
live = client.quotes(symbol="RELIANCE", exchange="NSE")["data"]["ltp"]

# Delayed: a free feed (yfinance) - good for study, but it lags the real market.
delayed = float(yf.Ticker("RELIANCE.NS").history(period="2d")["Close"].dropna().iloc[-1])

print(f"OpenAlgo (live)    : {live:>10.2f}")
print(f"yfinance (delayed) : {delayed:>10.2f}")
print(f"Difference         : {live - delayed:>+10.2f}")
