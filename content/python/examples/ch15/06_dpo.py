# DPO: removes the trend so you can see the price CYCLE underneath.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

# DPO (Detrended Price Oscillator) subtracts a shifted moving average. It is NOT a momentum
# indicator - it strips out the trend to expose short cycles (peaks and troughs).
df["DPO"] = ta.dpo(df["close"], period=20)

dpo = df["DPO"].iloc[-1]
print(df[["close", "DPO"]].tail(5).round(2))
print(f"\nLatest DPO(20): {dpo:+.2f}")
print("Cycle position:", "above its detrended average (toward a peak)" if dpo > 0
      else "below its detrended average (toward a trough)")
