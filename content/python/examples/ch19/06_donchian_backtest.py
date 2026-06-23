# A full Donchian system: hold a long between breakout and breakdown, preview the curve.
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
df = client.history(symbol="LT", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
upper, _, lower = ta.donchian(df["high"], df["low"], period=20)
upper = pd.Series(upper, index=df.index)
lower = pd.Series(lower, index=df.index)

# Enter when close clears the prior upper band; exit when it loses the prior lower band.
buy = close > upper.shift(1)
sell = close < lower.shift(1)
position = pd.Series(ta.flip(buy, sell), index=df.index).astype(int)

ret = close.pct_change().fillna(0)
strat = ret * position.shift(1).fillna(0)
print("Trades opened:", int((position.diff() == 1).sum()))
print("Days held    :", int(position.sum()), "of", len(position))
print("Strategy total return: {:.1f}%".format(((1 + strat).cumprod().iloc[-1] - 1) * 100))
print("Buy & hold   total return: {:.1f}%".format(((1 + ret).cumprod().iloc[-1] - 1) * 100))
