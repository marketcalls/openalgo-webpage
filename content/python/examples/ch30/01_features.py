# Feature engineering: turn raw prices into the columns a model can learn from.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
c = df["close"]

# A "feature" is one numeric clue the model reads. We build a table of them.
feat = pd.DataFrame(index=df.index)
feat["rsi"] = ta.rsi(c, 14)                       # momentum: overbought / oversold
feat["ret1"] = c.pct_change()                     # yesterday's return
feat["ret5"] = c.pct_change(5)                    # one-week return
feat["atr"] = ta.atr(df["high"], df["low"], c, 14)  # volatility (range size)
feat["ema_dist"] = (c - ta.ema(c, 20)) / c        # how far price is from its trend
feat = feat.dropna()                              # drop warm-up rows with no value yet

print(f"Built {feat.shape[1]} features over {feat.shape[0]} usable bars.")
print("\nLast 3 rows of the feature table:")
print(feat.tail(3).round(4))
