# Breakout scan: close making a new 20-day high. ta.highest does the heavy lifting.
import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

universe = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN",
            "AXISBANK", "WIPRO", "ITC", "LT", "MARUTI", "KOTAKBANK"]

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
N = 20


def daily(sym):
    df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    return df if isinstance(df, pd.DataFrame) and not df.empty else None


breakouts = []
for sym in universe:
    df = daily(sym)
    if df is None:
        continue
    # highest high over the PRIOR N bars -- index [-2] excludes today's own bar.
    prior_high = np.asarray(ta.highest(df["high"], N))[-2]
    last_close = float(df["close"].iloc[-1])
    if last_close > prior_high:
        breakouts.append((sym, last_close, round(float(prior_high), 2)))

print(f"New {N}-day-high breakouts:")
for sym, c, h in breakouts:
    print(f"  {sym:10s} close {c:>9.2f}  cleared prior high {h:>9.2f}")
print("Total:", len(breakouts))
