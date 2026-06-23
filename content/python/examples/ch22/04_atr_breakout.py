# ATR breakout entry: buy when price closes above yesterday's close + N x ATR.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

df["atr"] = ta.atr(df["high"], df["low"], df["close"], period=14)

# The breakout level sits one ATR above the PREVIOUS close. .shift(1) avoids look-ahead:
# we only use information that was known before today's bar formed.
mult = 1.0
df["trigger"] = df["close"].shift(1) + mult * df["atr"].shift(1)
df["breakout"] = df["close"] > df["trigger"]

signals = df[df["breakout"]][["close", "trigger"]].dropna()
print(f"Breakout days (close > prev close + {mult} ATR):", len(signals))
print(signals.tail(5).round(2))
print("\nSizing the trigger in ATRs adapts the strategy to each stock's own volatility.")
