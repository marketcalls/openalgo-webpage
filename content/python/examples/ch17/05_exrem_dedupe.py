# ta.exrem removes repeated signals so you don't buy twice before selling once.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=300)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
rsi = ta.rsi(close, 14)

# Raw level rules fire on EVERY qualifying bar, so an oversold or overbought
# stretch triggers a whole flurry of repeated buys (or sells).
raw_buy = pd.Series((rsi < 30).to_numpy(), index=df.index)    # buy while oversold
raw_sell = pd.Series((rsi > 55).to_numpy(), index=df.index)   # sell once recovered

# exrem(primary, secondary): keep a primary signal only until the next secondary.
clean_buy = pd.Series(ta.exrem(raw_buy, raw_sell), index=df.index)
clean_sell = pd.Series(ta.exrem(raw_sell, raw_buy), index=df.index)

print(f"{'':12s}{'raw':>6s}{'cleaned':>10s}")
print(f"{'BUY':12s}{int(raw_buy.sum()):>6d}{int(clean_buy.sum()):>10d}")
print(f"{'SELL':12s}{int(raw_sell.sum()):>6d}{int(clean_sell.sum()):>10d}")
print("exrem collapsed each flurry to its FIRST signal -- buys and sells now alternate.")
