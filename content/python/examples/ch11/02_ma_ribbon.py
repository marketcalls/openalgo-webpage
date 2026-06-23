# A "ribbon" of EMAs (fast to slow). When they stack in order, the trend is clean.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)

periods = [9, 21, 50, 100]
emas = {p: ta.ema(df["close"], p).iloc[-1] for p in periods}

print("TCS close:", round(df["close"].iloc[-1], 2))
for p in periods:
    print(f"  EMA{p:<3d} = {emas[p]:8.2f}")

# A bullish stack means fast EMAs sit above slow EMAs, in order.
ordered = [emas[p] for p in periods]
stacked_up = all(ordered[i] > ordered[i + 1] for i in range(len(ordered) - 1))
stacked_down = all(ordered[i] < ordered[i + 1] for i in range(len(ordered) - 1))
print("Ribbon:", "bullish stack" if stacked_up else "bearish stack" if stacked_down else "tangled / no clear trend")
