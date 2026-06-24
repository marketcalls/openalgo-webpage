# A quant replaces opinion with measurement. Let's measure how Nifty really behaves.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date=start, end_date=end)

rets = df["close"].pct_change().dropna() * 100      # daily returns in percent
up, down = rets[rets > 0], rets[rets < 0]

print(f"Trading days     : {len(rets)}")
print(f"Up days          : {len(up)} ({len(up) / len(rets) * 100:.1f}%)")
print(f"Down days        : {len(down)} ({len(down) / len(rets) * 100:.1f}%)")
print(f"Average up day   : +{up.mean():.2f}%")
print(f"Average down day : {down.mean():.2f}%")
print(f"Best / worst day : +{rets.max():.2f}% / {rets.min():.2f}%")
print("\nA discretionary trader feels the trend. A quant counts it.")
