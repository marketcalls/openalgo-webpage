# Correlation filter: only trade a pair whose two legs actually move together.
import os
import time
from datetime import datetime, timedelta

import numpy as np
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

# Correlation of DAILY RETURNS (not raw prices) is what matters for a pair.
rets = pair.pct_change().dropna()
corr = np.corrcoef(rets["ICICIBANK"], rets["HDFCBANK"])[0, 1]

print(f"Daily-return correlation: {corr:.3f}")
if corr > 0.6:
    print("Strong positive correlation -- a sensible pair to trade.")
else:
    print("Weak correlation -- skip this pair, the spread will not behave predictably.")
