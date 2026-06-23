# ta.crossover marks the single bar where a fast line crosses ABOVE a slow line.
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
df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
ema_fast = ta.ema(close, 10)
ema_slow = ta.ema(close, 20)

# crossover/crossunder return a NumPy array, not a Series.
# Wrap it back into a Series so it lines up with the DataFrame's dates.
cross_up = pd.Series(ta.crossover(ema_fast, ema_slow), index=df.index)

print("Type returned by ta.crossover:", type(ta.crossover(ema_fast, ema_slow)).__name__)
print("Bullish crosses in the window:", int(cross_up.sum()))
print("Dates of those crosses:")
print(close[cross_up].tail())
