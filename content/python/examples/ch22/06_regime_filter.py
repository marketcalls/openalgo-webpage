# Regime filter: only take long trades when price is above its 200-day SMA.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=500)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# The 200-day SMA is the classic line between a bull and a bear regime.
df["sma200"] = ta.sma(df["close"], 200)
df["bull"] = df["close"] > df["sma200"]

last = df.dropna().iloc[-1]
in_uptrend = bool(last["bull"])
bull_days = int(df["bull"].sum())

print(f"Close {last['close']:.1f}  vs 200-SMA {last['sma200']:.1f}")
print("Regime now:", "UPTREND -- longs allowed" if in_uptrend else "DOWNTREND -- stand aside")
print(f"Days in uptrend over the window: {bull_days} of {df['bull'].notna().sum()}")
print("\nA regime filter keeps you from buying momentum into a falling market -- the No.1 way these systems blow up.")
