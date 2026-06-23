# A quick equity-curve preview from signals -- no VectorBT yet (that's Chapter 26).
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
# A 20/50 EMA cross trades more often than 50/200 -- handy for showing a real curve.
fast, slow = ta.ema(close, 20), ta.ema(close, 50)
buy = pd.Series(ta.crossover(fast, slow), index=df.index)
sell = pd.Series(ta.crossunder(fast, slow), index=df.index)

# Hold a long while flip() is on; shift(1) so we earn TOMORROW's return, not today's.
position = pd.Series(ta.flip(buy, sell), index=df.index).astype(int)
daily_ret = close.pct_change().fillna(0)
strat_ret = daily_ret * position.shift(1).fillna(0)

strat_curve = (1 + strat_ret).cumprod()
buyhold_curve = (1 + daily_ret).cumprod()
print("Strategy   total return: {:.1f}%".format((strat_curve.iloc[-1] - 1) * 100))
print("Buy & hold total return: {:.1f}%".format((buyhold_curve.iloc[-1] - 1) * 100))
print("Days in the market:", int(position.sum()), "of", len(position))
print("Final equity on 1.0 start:", round(float(strat_curve.iloc[-1]), 3))
