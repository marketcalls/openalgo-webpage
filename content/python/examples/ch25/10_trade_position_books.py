# Trade book = what actually FILLED. Position book = what you currently HOLD.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Both books return their data as a list of dictionaries.
trades = client.tradebook()["data"]
print(f"Trades filled today: {len(trades)}")
for t in trades[:3]:
    print(f"  {t['action']:4s} {t['symbol']:16s} @ {t['average_price']}")

positions = client.positionbook()["data"]
open_pos = [p for p in positions if int(float(p["quantity"])) != 0]
print(f"\nOpen positions: {len(open_pos)}")
for p in open_pos[:5]:
    print(f"  {p['symbol']:16s} qty {p['quantity']:>4}  ltp {p['ltp']}  pnl {p['pnl']}")
