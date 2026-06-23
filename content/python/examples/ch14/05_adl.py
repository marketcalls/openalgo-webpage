# Accumulation/Distribution Line (ADL): a running tally of money flow.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)

# ADL is cumulative, like OBV, but weights volume by WHERE the close lands in the bar.
df["ADL"] = ta.adl(df["high"], df["low"], df["close"], df["volume"])

# Rising ADL into a flat/up price = accumulation supporting the move.
adl_slope = df["ADL"].iloc[-1] - df["ADL"].iloc[-6]
print(df[["close", "ADL"]].tail(5).round(0))
print(f"\n5-day ADL change: {adl_slope:+,.0f}")
print("Money flow is", "building (accumulation)" if adl_slope > 0 else "leaking out (distribution)")
