# Intraday EMA crossover: a fast EMA crossing a slow EMA is a classic momentum signal.
import os
from datetime import datetime, timedelta

import pandas as pd

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=8)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="5m", start_date=start, end_date=end)

df["ema_fast"] = ta.ema(df["close"], 9)
df["ema_slow"] = ta.ema(df["close"], 21)

# crossover() returns a numpy boolean array; wrap it in a Series to align with the index.
df["buy"] = pd.Series(ta.crossover(df["ema_fast"], df["ema_slow"]), index=df.index)
df["sell"] = pd.Series(ta.crossunder(df["ema_fast"], df["ema_slow"]), index=df.index)

print("Bullish 9/21 EMA crosses:", int(df["buy"].sum()))
print("Bearish 9/21 EMA crosses:", int(df["sell"].sum()))
print("\nMost recent crossover signals:")
crosses = df[df["buy"] | df["sell"]]
for ts, row in crosses.tail(4).iterrows():
    print(f"  {ts.strftime('%m-%d %H:%M')}  {'BUY ' if row['buy'] else 'SELL'}  close {row['close']:.1f}")
