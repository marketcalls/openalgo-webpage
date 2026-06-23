# highest / lowest: rolling extremes that define breakout levels.
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
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# highest/lowest return NUMPY ARRAYS of the rolling max/min over the window.
hh = ta.highest(df["high"], 20)
ll = ta.lowest(df["low"], 20)
print("ta.highest returns a", type(hh).__name__)

# A 20-day breakout: today's close pushes past the prior 20-day high.
prior_high = np.asarray(hh)[-2]   # the highest high as of yesterday
last_close = df["close"].iloc[-1]
print(f"\n20-day high (as of yesterday): {prior_high:,.0f}")
print(f"20-day low  (latest)         : {np.asarray(ll)[-1]:,.0f}")
print(f"Today's close                : {last_close:,.0f}")
print("Breakout:", "YES - new 20-day high" if last_close > prior_high else "no breakout yet")
