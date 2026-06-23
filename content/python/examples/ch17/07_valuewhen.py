# ta.valuewhen grabs the price (or any value) at the most recent signal bar.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
fast, slow = ta.ema(close, 10), ta.ema(close, 20)
buy = pd.Series(ta.crossover(fast, slow), index=df.index)

# At every bar, what was the close on the LAST buy signal? (n=1 = most recent)
entry_price = pd.Series(ta.valuewhen(buy, close, 1), index=df.index)
open_pnl_pct = (close - entry_price) / entry_price * 100

print("Last entry price the signal would have used:", round(float(entry_price.iloc[-1]), 2))
print("Latest close:", round(float(close.iloc[-1]), 2))
print("Open P&L since that entry: {:.2f}%".format(float(open_pnl_pct.iloc[-1])))
