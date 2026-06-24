# Circuit breakers exist for the market's worst days. How often is one actually tripped?
import os
from datetime import datetime

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2019-01-01", end_date=end)
r = df["close"].pct_change().dropna() * 100      # daily % moves


def circuit(move):
    m = abs(move)
    if m >= 20:
        return "20% - halt for the day"
    if m >= 15:
        return "15% - long halt"
    if m >= 10:
        return "10% - 45-min halt"
    return "-"


print(f"{len(df)} NIFTY sessions since 2019\n")
print("Biggest DOWN days:")
for ts, move in r.nsmallest(4).items():
    print(f"  {ts.date()}  {move:7.2f}%   circuit: {circuit(move)}")
print("\nBiggest UP days:")
for ts, move in r.nlargest(4).items():
    print(f"  {ts.date()}  {move:7.2f}%   circuit: {circuit(move)}")
print(f"\nSessions that tripped an index circuit (>=10%): {(r.abs() >= 10).sum()} of {len(r)}")
