# Amihud illiquidity: how far does price move per rupee traded? Higher = thinner.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
basket = ["HDFCBANK", "RELIANCE", "INFY", "TATASTEEL", "BANKBARODA", "YESBANK"]

rows = []
for sym in basket:
    df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    abs_ret = df["close"].pct_change().abs()
    rupee_vol = df["volume"] * df["close"]                 # daily turnover in rupees
    illiq = (abs_ret / rupee_vol.replace(0, float("nan"))).dropna().mean() * 1e9
    rows.append((sym, illiq, rupee_vol.mean() / 1e7))      # turnover in crore

print(f"{'STOCK':12s}{'ILLIQ (x1e9)':>14s}{'TURNOVER (cr)':>16s}")
for sym, illiq, turnover in sorted(rows, key=lambda r: r[1]):
    print(f"{sym:12s}{illiq:>14.4f}{turnover:>16.0f}")
print("\nMore illiquid = price moves more per rupee traded = costlier to trade in size.")
