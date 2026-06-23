# The same scanner pattern works on any exchange -- here a small MCX commodity list.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# MCX futures carry their own symbol + expiry; the loop logic is unchanged.
mcx = ["GOLDM03JUL26FUT", "SILVERM30JUN26FUT", "CRUDEOIL20JUL26FUT"]

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")

print(f"{'SYMBOL':20s}{'CLOSE':>12s}{'RSI14':>8s}{'TREND':>10s}")
for sym in mcx:
    df = client.history(symbol=sym, exchange="MCX", interval="D", start_date=start, end_date=end)
    if not (isinstance(df, pd.DataFrame) and not df.empty):
        print(f"{sym:20s}{'no data':>12s}")
        continue
    close = df["close"].iloc[-1]
    rsi = float(ta.rsi(df["close"], 14).iloc[-1])
    trend = "up" if close > float(ta.ema(df["close"], 20).iloc[-1]) else "down"
    print(f"{sym:20s}{close:>12.2f}{rsi:>8.1f}{trend:>10s}")
