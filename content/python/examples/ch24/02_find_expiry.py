# Discover a valid expiry at runtime -- never hard-code dates that go stale.
import os
from datetime import datetime

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

resp = client.expiry(symbol="NIFTY", exchange="NFO", instrumenttype="options")
dates = resp["data"]  # e.g. ['23-JUN-26', '30-JUN-26', ...]
print("Expiries available:", dates[:5], "...")

# Keep only expiries strictly after today, then pick the nearest one.
today = datetime.now().date()
future = sorted(d for d in (datetime.strptime(x, "%d-%b-%y").date() for x in dates) if d > today)
nearest = future[0]
# Option endpoints want the compact DDMMMYY form, e.g. 30JUN26.
compact = nearest.strftime("%d%b%y").upper()

print("\nNearest future expiry:", nearest, "->", compact)
print("Days away            :", (nearest - today).days)
