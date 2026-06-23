# Vortex Indicator (VI): two lines whose crossover marks a trend change.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="CRUDEOIL20JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# Vortex is two lines built from up-move (VI+) and down-move (VI-) vs the true range.
# We build it directly so you can see the formula: sum the moves over N bars, divide by
# the summed true range. When VI+ is above VI-, an uptrend; below, a downtrend.
period = 14
h, low_, c = df["high"], df["low"], df["close"]
prev_c = c.shift(1)
true_range = pd.concat([h - low_, (h - prev_c).abs(), (low_ - prev_c).abs()], axis=1).max(axis=1)
vm_plus = (h - low_.shift(1)).abs()
vm_minus = (low_ - h.shift(1)).abs()
str_sum = true_range.rolling(period).sum()
df["VI_Plus"] = vm_plus.rolling(period).sum() / str_sum
df["VI_Minus"] = vm_minus.rolling(period).sum() / str_sum

p, m = df["VI_Plus"].iloc[-1], df["VI_Minus"].iloc[-1]
print(df[["close", "VI_Plus", "VI_Minus"]].tail(5).round(3))
print(f"\nLatest VI+: {p:.3f}   VI-: {m:.3f}")
print("Trend:", "up (VI+ leads)" if p > m else "down (VI- leads)")
print("Spread:", f"{abs(p - m):.3f}  (wider = stronger trend)")
