# Connors RSI (a mean-reversion RSI) and Balance of Power (buyers vs sellers each bar).
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

crsi = ta.crsi(df["close"]).iloc[-1]
bop = ta.bop(df["open"], df["high"], df["low"], df["close"]).iloc[-1]

print("ICICIBANK close:", round(df["close"].iloc[-1], 2))
print(f"Connors RSI    : {crsi:6.2f}")
# Connors RSI is twitchy: <10 is deeply oversold, >90 deeply overbought.
print("  ->", "deeply oversold (<10)" if crsi < 10 else "deeply overbought (>90)" if crsi > 90 else "neutral zone")
print(f"Balance of Power: {bop:6.3f}  (range -1 to +1)")
print("  ->", "buyers in control" if bop > 0 else "sellers in control")
