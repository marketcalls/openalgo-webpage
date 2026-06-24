# Volatility targeting: give every position the SAME rupee risk, whatever its vol.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

RISK_PER_NAME = 5000.0       # target rupee risk for each holding
WATCHLIST = [("RELIANCE", "NSE"), ("TATASTEEL", "NSE"), ("GOLDM03JUL26FUT", "MCX")]

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")

print(f"{'SYMBOL':18s}{'PRICE':>10s}{'ATR':>9s}{'QTY':>7s}{'RISK':>12s}")
for sym, exch in WATCHLIST:
    df = client.history(symbol=sym, exchange=exch, interval="D", start_date=start, end_date=end)
    price = df["close"].iloc[-1]
    atr = ta.atr(df["high"], df["low"], df["close"], 14).iloc[-1]
    qty = int(RISK_PER_NAME // (2 * atr))      # 2 x ATR stop distance
    print(f"{sym:18s}{price:>10.2f}{atr:>9.2f}{qty:>7d}{qty * 2 * atr:>12,.2f}")

print(f"\nEach line risks about {RISK_PER_NAME:,.0f} - the volatile names just get fewer units.")
