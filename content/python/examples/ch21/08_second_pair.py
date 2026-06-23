# A second pair from the public-sector banks: SBIN and BANKBARODA.
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


pair = pd.DataFrame({"SBIN": closes("SBIN"), "BANKBARODA": closes("BANKBARODA")}).dropna()
pair["ratio"] = pair["SBIN"] / pair["BANKBARODA"]
pair["z"] = (pair["ratio"] - pair["ratio"].rolling(30).mean()) / pair["ratio"].rolling(30).std()

rets = pair[["SBIN", "BANKBARODA"]].pct_change().dropna()
corr = np.corrcoef(rets["SBIN"], rets["BANKBARODA"])[0, 1]

print(f"SBIN / BANKBARODA return correlation: {corr:.3f}")
print(f"Current ratio: {pair['ratio'].iloc[-1]:.3f}   z-score: {pair['z'].iloc[-1]:.2f}")
print("\nSame recipe, different pair. Always re-check correlation -- not every duo behaves.")
