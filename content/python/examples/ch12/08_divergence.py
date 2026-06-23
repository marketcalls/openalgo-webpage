# Divergence: price makes a new high but RSI doesn't -- a warning the push is tiring.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
df["RSI"] = ta.rsi(df["close"], 14)

# Compare the last 10 bars with the 10 before them.
recent, prior = df.tail(10), df.iloc[-20:-10]
price_higher = recent["close"].max() > prior["close"].max()
rsi_higher = recent["RSI"].max() > prior["RSI"].max()

print("RELIANCE last 20 sessions")
print(f"Price high : prior {prior['close'].max():.2f} -> recent {recent['close'].max():.2f}")
print(f"RSI  high  : prior {prior['RSI'].max():.2f} -> recent {recent['RSI'].max():.2f}")

if price_higher and not rsi_higher:
    print("Bearish divergence: higher price, weaker RSI -> momentum fading")
elif not price_higher and rsi_higher:
    print("Bullish divergence: lower price, stronger RSI -> selling fading")
else:
    print("No divergence: price and RSI agree")
