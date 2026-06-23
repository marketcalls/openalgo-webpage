# The look-ahead trap: a signal on today's CLOSE can only be acted on TOMORROW.
# .shift(1) moves the signal forward one bar so the backtest stays honest.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

close = df["close"]
fast, slow = ta.ema(close, 10), ta.ema(close, 20)
signal_today = pd.Series(ta.crossover(fast, slow), index=df.index)

# Shift the signal: a cross seen on close[t] becomes tradable on bar t+1.
tradable = signal_today.shift(1).fillna(False)

cmp = pd.DataFrame({"close": close, "signal_today": signal_today, "tradable_next_bar": tradable})
print(cmp.tail(6))
print("Acting on 'tradable_next_bar' avoids buying at a price you couldn't have known yet.")
