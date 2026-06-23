# Relative-volume scan: today's volume vs its 20-day average. >1.5 means unusual interest.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

universe = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN",
            "AXISBANK", "WIPRO", "ITC", "LT", "MARUTI", "KOTAKBANK"]

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")


def daily(sym):
    df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    return df if isinstance(df, pd.DataFrame) and not df.empty else None


rows = []
for sym in universe:
    df = daily(sym)
    if df is None:
        continue
    avg20 = df["volume"].rolling(20).mean().iloc[-1]
    rvol = df["volume"].iloc[-1] / avg20 if avg20 else 0
    rows.append((sym, round(float(rvol), 2)))

rows.sort(key=lambda x: x[1], reverse=True)
print("Relative volume (today / 20-day avg), highest first:")
for sym, rvol in rows:
    flag = "  <-- elevated" if rvol > 1.5 else ""
    print(f"  {sym:10s}{rvol:>6.2f}x{flag}")
