# End to end: build clean, shifted entry+exit arrays for an EMA crossover.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=300)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
fast, slow = ta.ema(close, 20), ta.ema(close, 50)

raw_buy = pd.Series(ta.crossover(fast, slow), index=df.index)
raw_sell = pd.Series(ta.crossunder(fast, slow), index=df.index)

# 1) de-duplicate so entries/exits alternate, 2) shift to trade on the next bar.
entries = pd.Series(ta.exrem(raw_buy, raw_sell), index=df.index).shift(1).fillna(False)
exits = pd.Series(ta.exrem(raw_sell, raw_buy), index=df.index).shift(1).fillna(False)

print("Final tradable entries:", int(entries.sum()), "| exits:", int(exits.sum()))
print("These two boolean arrays are exactly what a backtester (Chapter 26) consumes.")
print(pd.DataFrame({"close": close, "entry": entries, "exit": exits})[entries | exits].tail())
