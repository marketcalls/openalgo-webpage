# rising / falling: simple trend filters you can stack onto any signal.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# rising/falling return NUMPY BOOLEAN ARRAYS: True if a value is higher/lower than n bars ago.
price_rising = ta.rising(df["close"], 3)
vol_rising = ta.rising(df["volume"], 3)
print("ta.rising returns a", type(price_rising).__name__, "of dtype", price_rising.dtype)

# Combine filters with & to demand both at once: a price up-move backed by rising volume.
confirmed = price_rising & vol_rising

print(f"\nBars where price has risen 3 sessions : {int(np.sum(price_rising))}")
print(f"Bars where BOTH price AND volume rising: {int(np.sum(confirmed))}")
print("Latest bar:", "confirmed up-move (price + volume)" if confirmed[-1]
      else "no confirmed up-move")
print(f"Price falling now? {bool(ta.falling(df['close'], 3)[-1])}")
