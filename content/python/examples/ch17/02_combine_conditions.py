# Real signals combine several questions with & (and) and | (or).
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
ema50 = ta.ema(close, 50)
rsi = ta.rsi(close, 14)

# A "trend-with-momentum" filter: price above EMA50 AND RSI above 50.
# Each side is wrapped in ( ) -- a habit that avoids hard-to-find bugs.
bullish = (close > ema50) & (rsi > 50)

print("Days passing BOTH conditions:", int(bullish.sum()))
print("Today -- above EMA50:", bool((close > ema50).iloc[-1]),
      "| RSI>50:", bool((rsi > 50).iloc[-1]),
      "| signal:", bool(bullish.iloc[-1]))
