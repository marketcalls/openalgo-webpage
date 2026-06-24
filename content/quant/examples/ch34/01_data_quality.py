# Data hygiene: real market data is messy. Always run a quality check before trusting it.
import os
from datetime import datetime

import numpy as np
import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date="2019-01-01", end_date=end)
r = df["close"].pct_change()

# Business-day calendar gaps that aren't weekends (could be holidays or missing data)
expected = pd.bdate_range(df.index.min(), df.index.max())
missing = len(expected) - len(df.index.normalize().intersection(expected))

print(f"Rows                     : {len(df)}")
print(f"Date range               : {df.index.min().date()} -> {df.index.max().date()}")
print(f"Business days not present : {missing}  (holidays + any gaps)")
print(f"Zero-volume bars         : {(df['volume'] == 0).sum()}")
print(f"Duplicated timestamps    : {df.index.duplicated().sum()}")
print(f"Extreme moves (|ret|>20%): {(r.abs() > 0.20).sum()}  (bad ticks or corporate actions?)")
print(f"NaNs in close            : {df['close'].isna().sum()}")
print("\nNever feed raw data straight into a backtest - clean it, or your edge is a data artefact.")
