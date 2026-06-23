# ta.flip turns one-bar entry/exit signals into a held position (an "in trade" flag).
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
df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
fast, slow = ta.ema(close, 10), ta.ema(close, 20)
buy = pd.Series(ta.crossover(fast, slow), index=df.index)
sell = pd.Series(ta.crossunder(fast, slow), index=df.index)

# flip(on, off) = 1 from a buy bar onward, back to 0 from the next sell bar.
in_position = pd.Series(ta.flip(buy, sell), index=df.index).astype(int)

print("Bars spent in a position:", int(in_position.sum()), "of", len(in_position))
print("Currently in a trade:", "YES" if in_position.iloc[-1] else "NO")
print(in_position.tail(8))
