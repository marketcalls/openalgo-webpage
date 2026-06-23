# crossover / crossunder: the moment one line crosses another.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

fast = ta.ema(df["close"], 10)
slow = ta.ema(df["close"], 20)

# crossover/crossunder return NUMPY BOOLEAN ARRAYS: True only on the bar of the cross.
buy = ta.crossover(fast, slow)
sell = ta.crossunder(fast, slow)
print("ta.crossover returns a", type(buy).__name__, "of dtype", buy.dtype)

print(f"\nBuy crosses (10 EMA over 20 EMA): {int(np.sum(buy))}")
print(f"Sell crosses (10 EMA under 20 EMA): {int(np.sum(sell))}")

# Use the boolean array to pull the dates/prices where a cross happened.
buy_dates = df.index[buy]
print("\nMost recent BUY cross dates:")
for d in buy_dates[-3:]:
    print(f"  {d.date()}  close {df.loc[d, 'close']:.2f}")
