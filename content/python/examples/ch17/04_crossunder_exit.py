# ta.crossunder is the mirror image -- the bar where fast crosses BELOW slow.
# Pair it with crossover and you have raw entries and exits.
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
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
fast, slow = ta.ema(close, 10), ta.ema(close, 20)

buy = pd.Series(ta.crossover(fast, slow), index=df.index)
sell = pd.Series(ta.crossunder(fast, slow), index=df.index)

print("Raw BUY signals :", int(buy.sum()))
print("Raw SELL signals:", int(sell.sum()))
print("Last 3 buy dates :", list(close[buy].tail(3).index.strftime("%Y-%m-%d")))
print("Last 3 sell dates:", list(close[sell].tail(3).index.strftime("%Y-%m-%d")))
