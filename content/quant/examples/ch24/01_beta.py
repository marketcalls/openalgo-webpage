# CAPM beta: how much a stock amplifies (or dampens) the market's moves.
import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=730)).strftime("%Y-%m-%d")

mkt = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                     start_date=start, end_date=end)["close"].pct_change()

print(f"{'STOCK':12s}{'BETA':>7s}   reads as")
for sym in ["TATASTEEL", "ADANIENT", "HDFCBANK", "ITC", "HINDUNILVR"]:
    s = client.history(symbol=sym, exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"].pct_change()
    df = pd.concat([mkt, s], axis=1).dropna()
    beta = np.cov(df.iloc[:, 1], df.iloc[:, 0])[0, 1] / np.var(df.iloc[:, 0])
    tag = "high beta - amplifies the market" if beta > 1 else "low beta - defensive"
    print(f"{sym:12s}{beta:>7.2f}   {tag}")

print("\nBeta is your exposure to the MARKET factor - the first and biggest driver of a stock's return.")
