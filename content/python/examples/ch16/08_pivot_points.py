# Pivot Points: classic support/resistance levels from the prior bar.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
df = client.history(symbol="CRUDEOIL20JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# pivot_points returns a 7-TUPLE: pivot, r1, s1, r2, s2, r3, s3.
pivot, r1, s1, r2, s2, r3, s3 = ta.pivot_points(df["high"], df["low"], df["close"])
df["Pivot"], df["R1"], df["S1"] = pivot, r1, s1

last = df.iloc[-1]
print(df[["close", "S1", "Pivot", "R1"]].tail(3).round(1))
print(f"\nLatest close: {last['close']:.1f}")
print(f"  Resistance 1: {last['R1']:.1f}")
print(f"  Pivot       : {last['Pivot']:.1f}")
print(f"  Support 1   : {last['S1']:.1f}")
print("Bias:", "above pivot - bullish" if last["close"] > last["Pivot"] else "below pivot - bearish")
