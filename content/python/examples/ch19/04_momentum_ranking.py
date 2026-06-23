# Momentum ranking: sort a universe by N-day return and buy the leaders.
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
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
LOOKBACK = 60  # trading-bar momentum window


def daily(sym):
    df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    return df if isinstance(df, pd.DataFrame) and not df.empty else None


rows = []
for sym in universe:
    df = daily(sym)
    if df is None or len(df) <= LOOKBACK:
        continue
    close = df["close"]
    mom = (close.iloc[-1] / close.iloc[-1 - LOOKBACK] - 1) * 100
    rows.append({"symbol": sym, "momentum_%": round(float(mom), 2)})

ranked = pd.DataFrame(rows).sort_values("momentum_%", ascending=False).reset_index(drop=True)
ranked.index += 1
print(f"Ranked by {LOOKBACK}-bar momentum. A rotation would hold the top 3:")
print(ranked.to_string())
print("\nTop 3 to hold this month:", list(ranked["symbol"].head(3)))
