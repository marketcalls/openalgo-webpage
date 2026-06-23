# Step 1 of a by-hand backtest: turn an EMA crossover into BUY/SELL signals.
import datetime
import os

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="SBIN", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)

# A trend signal: fast EMA above slow EMA = uptrend (be long), below = flat.
fast = ta.ema(close, 10)
slow = ta.ema(close, 30)
signal = (fast > slow).astype(int)   # 1 when bullish, 0 otherwise

print(f"Bars: {len(close)}")
print(f"Days the signal says 'be long': {int(signal.sum())}")
print(signal.tail(5).to_string())
