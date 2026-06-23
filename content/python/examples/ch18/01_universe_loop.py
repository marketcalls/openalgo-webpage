# A scanner is just a loop over a universe. Start with the simplest version.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

universe = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN"]

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")


def daily(sym, exchange="NSE"):
    # Return a clean OHLCV frame, or None if the server hiccups on one symbol.
    df = client.history(symbol=sym, exchange=exchange, interval="D", start_date=start, end_date=end)
    return df if isinstance(df, pd.DataFrame) and not df.empty else None


print(f"{'SYMBOL':12s}{'CLOSE':>10s}{'RSI14':>8s}")
for sym in universe:
    df = daily(sym)
    if df is None:
        print(f"{sym:12s}{'no data':>10s}")
        continue
    rsi = ta.rsi(df["close"], 14)
    print(f"{sym:12s}{df['close'].iloc[-1]:>10.2f}{rsi.iloc[-1]:>8.1f}")
