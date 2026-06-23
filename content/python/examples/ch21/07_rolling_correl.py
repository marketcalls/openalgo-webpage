# Correlation is not constant -- track it with a rolling window using ta.correlation.
import os
import time
from datetime import datetime, timedelta

import pandas as pd

from openalgo import api, ta

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

# Correlate DAILY RETURNS (not raw prices) -- same rule as the static filter earlier.
rets = pair.pct_change().dropna()
# ta.correlation gives a rolling Pearson correlation between two series.
pair["correl_30"] = ta.correlation(rets["ICICIBANK"], rets["HDFCBANK"], 30)

recent = pair["correl_30"].dropna()
print("Rolling 30-day return correlation:")
print(recent.tail(6).round(3))
print(f"\nLowest it dropped to: {recent.min():.3f}")
print("When rolling correlation collapses, the pair has 'broken' -- stand aside until it recovers.")
