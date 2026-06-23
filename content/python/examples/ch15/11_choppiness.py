# Choppiness Index: is the market TRENDING or RANGING right now?
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY30JUN26FUT", exchange="NFO", interval="D", start_date=start, end_date=end)

# CHOP is bounded 0..100 but it measures TREND vs RANGE, not direction.
# High (>61.8) = choppy/sideways; low (<38.2) = strong directional trend.
df["CHOP"] = ta.chop(df["high"], df["low"], df["close"], period=14)

chop = df["CHOP"].iloc[-1]
print(df[["close", "CHOP"]].tail(5).round(1))
print(f"\nLatest Choppiness: {chop:.1f}")
if chop > 61.8:
    print("Regime: CHOPPY / sideways - favour range tools, avoid trend-following")
elif chop < 38.2:
    print("Regime: TRENDING strongly - favour trend-following, avoid mean-reversion")
else:
    print("Regime: in between - no clear edge for either style")
