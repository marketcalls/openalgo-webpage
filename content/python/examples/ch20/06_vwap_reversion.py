# VWAP mean-reversion: fade stretches away from VWAP, expecting a snap back.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=8)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="5m", start_date=start, end_date=end)

df["vwap"] = ta.vwap(df["high"], df["low"], df["close"], df["volume"], anchor="Session")
# Distance from VWAP measured in that session's percentage terms.
df["dist"] = (df["close"] - df["vwap"]) / df["vwap"] * 100

# Reversion idea: when price is unusually FAR below VWAP, buy expecting a pullback up.
threshold = 0.40  # percent
dips = df[df["dist"] < -threshold]

print(f"5m bars more than {threshold:.2f}% below VWAP (buy-the-dip candidates):", len(dips))
print(dips[["close", "vwap", "dist"]].tail(5).round(3))
print("\nMean-reversion assumes the gap closes. It works in range days, NOT in strong trends.")
