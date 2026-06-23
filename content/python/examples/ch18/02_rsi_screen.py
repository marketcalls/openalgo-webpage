# RSI screen: list only the names that are oversold or overbought right now.
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
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")


def daily(sym):
    df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    return df if isinstance(df, pd.DataFrame) and not df.empty else None


oversold, overbought = [], []
for sym in universe:
    df = daily(sym)
    if df is None:
        continue
    r = float(ta.rsi(df["close"], 14).iloc[-1])
    if r < 30:
        oversold.append((sym, round(r, 1)))
    elif r > 70:
        overbought.append((sym, round(r, 1)))

print("Oversold (RSI < 30) :", oversold or "none")
print("Overbought (RSI > 70):", overbought or "none")
print(f"Scanned {len(universe)} names.")
