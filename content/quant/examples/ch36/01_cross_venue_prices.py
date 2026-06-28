# Cross-venue prices: the same stock quoted on NSE and BSE, and where to buy vs sell.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Large dual-listed names trade on both NSE and BSE at the same time.
SYMBOLS = ["RELIANCE", "TCS", "HDFCBANK"]

print(f"{'SYMBOL':<10}{'NSE':>10}{'BSE':>10}{'GAP Rs':>9}{'GAP bps':>9}   BUY @   SELL @")
for sym in SYMBOLS:
    n = client.quotes(symbol=sym, exchange="NSE")["data"]["ltp"]
    b = client.quotes(symbol=sym, exchange="BSE")["data"]["ltp"]
    gap = n - b                              # NSE minus BSE
    bps = 10000 * gap / ((n + b) / 2)        # gap as a fraction of mid, in basis points
    buy_at = "NSE" if n <= b else "BSE"      # buy where it is cheaper
    sell_at = "BSE" if b >= n else "NSE"     # sell where it is dearer
    print(f"{sym:<10}{n:>10.2f}{b:>10.2f}{gap:>+9.2f}{bps:>+9.1f}   {buy_at:<7} {sell_at}")

# Focus on one name for the one-line takeaway.
sym = SYMBOLS[0]
n = client.quotes(symbol=sym, exchange="NSE")["data"]["ltp"]
b = client.quotes(symbol=sym, exchange="BSE")["data"]["ltp"]
better_buy = "NSE" if n <= b else "BSE"
better_sell = "BSE" if b >= n else "NSE"
print(f"\n{sym}: NSE {n} vs BSE {b}. A smart router buys on {better_buy} (cheaper) "
      f"and sells on {better_sell} (dearer); gap {abs(n - b):.2f} Rs "
      f"({abs(10000 * (n - b) / ((n + b) / 2)):.1f} bps).")
