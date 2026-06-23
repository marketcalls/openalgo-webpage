# valuewhen: recall the price at the last time a condition was true.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

fast, slow = ta.ema(df["close"], 10), ta.ema(df["close"], 20)
buy = ta.crossover(fast, slow)

# valuewhen pulls the value of a series at the bar a condition last fired.
# n=1 = most recent buy, n=2 = the buy before that.
entry_price = ta.valuewhen(buy, df["close"], 1)
print("ta.valuewhen returns a", type(entry_price).__name__)

last_entry = float(np.asarray(entry_price)[-1])
now = df["close"].iloc[-1]
print(f"\nPrice at the last EMA buy cross: {last_entry:.2f}")
print(f"Current price                  : {now:.2f}")
print(f"Open trade P&L                 : {(now - last_entry) / last_entry * 100:+.2f}%")
print("\nvaluewhen is how a strategy remembers its entry to size stops and targets.")
