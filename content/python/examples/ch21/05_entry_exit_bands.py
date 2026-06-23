# Entry/exit bands: enter when |z| > 2, exit when the spread returns near 0.
import os
import time
from datetime import datetime, timedelta

import pandas as pd

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")


def closes(symbol):
    for _ in range(3):
        df = client.history(symbol=symbol, exchange="NSE", interval="D",
                            start_date=start, end_date=end)
        if isinstance(df, pd.DataFrame) and "close" in df:
            return df["close"]
        time.sleep(1)
    raise RuntimeError(f"Could not fetch history for {symbol}: {df}")


pair = pd.DataFrame({"ICICIBANK": closes("ICICIBANK"), "HDFCBANK": closes("HDFCBANK")}).dropna()
pair["ratio"] = pair["ICICIBANK"] / pair["HDFCBANK"]
pair["z"] = (pair["ratio"] - pair["ratio"].rolling(30).mean()) / pair["ratio"].rolling(30).std()

# The trading rules, as plain English -> code:
#   z > +2  : ratio too HIGH -> SELL ICICIBANK, BUY HDFCBANK (bet it falls back)
#   z < -2  : ratio too LOW  -> BUY ICICIBANK, SELL HDFCBANK (bet it rises back)
#   |z| < 0.5: spread back to normal -> close the trade.
pair["signal"] = "flat"
pair.loc[pair["z"] > 2, "signal"] = "short_spread"
pair.loc[pair["z"] < -2, "signal"] = "long_spread"
pair.loc[pair["z"].abs() < 0.5, "signal"] = "exit"

events = pair[pair["signal"] != "flat"][["ratio", "z", "signal"]].dropna()
print("Recent band events (entries and exits):")
print(events.tail(8).round(3))
