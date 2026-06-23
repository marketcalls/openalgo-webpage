# VWMA leans on volume; KAMA speeds up in trends and slows in chop. Tested on MCX gold.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d")

df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="15m", start_date=start, end_date=end)

df["SMA20"] = ta.sma(df["close"], 20)
df["VWMA20"] = ta.vwma(df["close"], df["volume"], 20)
df["KAMA"] = ta.kama(df["close"])

print("GOLDM 15m candles:", len(df))
print(f"Close      : {df['close'].iloc[-1]:9.1f}")
print(f"SMA20      : {df['SMA20'].iloc[-1]:9.1f}  (every candle counts equally)")
print(f"VWMA20     : {df['VWMA20'].iloc[-1]:9.1f}  (high-volume candles count more)")
print(f"KAMA       : {df['KAMA'].iloc[-1]:9.1f}  (adapts to volatility)")

# When VWMA differs from SMA, busy candles are pulling the average around.
diff = df["VWMA20"].iloc[-1] - df["SMA20"].iloc[-1]
print("Volume tilt:", "up" if diff > 0 else "down", f"({diff:+.1f} points vs plain SMA)")
