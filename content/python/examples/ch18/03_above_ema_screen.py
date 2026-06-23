# Trend screen: which names are trading above their 50-day EMA?
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

universe = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN",
            "AXISBANK", "WIPRO", "ITC", "LT", "MARUTI", "KOTAKBANK"]

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")


def daily(sym):
    df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    return df if isinstance(df, pd.DataFrame) and not df.empty else None


in_uptrend = []
for sym in universe:
    df = daily(sym)
    if df is None:
        continue
    close = df["close"].iloc[-1]
    ema50 = float(ta.ema(df["close"], 50).iloc[-1])
    if close > ema50:
        in_uptrend.append((sym, round((close / ema50 - 1) * 100, 1)))

in_uptrend.sort(key=lambda x: x[1], reverse=True)
print(f"{len(in_uptrend)}/{len(universe)} names are above their EMA50.")
print("Symbol  % above EMA50")
for sym, pct in in_uptrend:
    print(f"{sym:10s}{pct:>6.1f}%")
