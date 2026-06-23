# Time-based exit: square off everything by a cutoff time, no matter what.
import os
from datetime import datetime, timedelta

import pandas as pd

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=8)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="5m", start_date=start, end_date=end)

# Entries from a 9/21 EMA cross...
df["buy"] = pd.Series(ta.crossover(ta.ema(df["close"], 9), ta.ema(df["close"], 21)), index=df.index)

# ...but force ALL positions flat after the cutoff. A time mask makes this trivial.
CUTOFF = "15:10"
square_off = df.index.indexer_between_time(CUTOFF, "15:30")
df["force_exit"] = False
df.iloc[square_off, df.columns.get_loc("force_exit")] = True

buys_after_cutoff = df[(df["buy"]) & (df["force_exit"])]
print(f"Square-off window starts at {CUTOFF} IST.")
print("New entries blocked after cutoff:", len(buys_after_cutoff), "(we ignore late signals)")
print("Bars in the square-off window per session:",
      int(df["force_exit"].sum() / df.index.normalize().nunique()))
print("\nIntraday rule: never carry an MIS position into the close -- the broker auto-squares it for you.")
