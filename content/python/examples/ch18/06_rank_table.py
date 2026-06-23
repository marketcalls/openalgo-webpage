# Gather several metrics per name into a pandas table, then rank by momentum.
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
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")


def daily(sym):
    df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    return df if isinstance(df, pd.DataFrame) and not df.empty else None


rows = []
for sym in universe:
    df = daily(sym)
    if df is None:
        continue
    close = df["close"]
    ret_20 = (close.iloc[-1] / close.iloc[-21] - 1) * 100  # 20-day return
    rows.append({"symbol": sym,
                 "close": round(float(close.iloc[-1]), 2),
                 "rsi14": round(float(ta.rsi(close, 14).iloc[-1]), 1),
                 "ret_20d_%": round(float(ret_20), 2)})

table = pd.DataFrame(rows).sort_values("ret_20d_%", ascending=False).reset_index(drop=True)
table.index += 1  # rank starts at 1
print("Universe ranked by 20-day return (strongest first):")
print(table.to_string())
