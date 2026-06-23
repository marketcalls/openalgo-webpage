# Parabolic SAR: a trailing stop that flips with the trend.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

# Despite the docs hinting at a tuple, ta.psar returns a SINGLE Series of stop levels.
# When price is above the SAR dot you're long; below, you're short.
df["SAR"] = ta.psar(df["high"], df["low"], acceleration=0.02, maximum=0.2)
print("ta.psar returns a", type(df["SAR"]).__name__)

last = df.iloc[-1]
print(df[["close", "SAR"]].tail(5).round(2))
print(f"\nClose: {last['close']:.2f}   SAR: {last['SAR']:.2f}")
print("Position:", "LONG (price above SAR)" if last["close"] > last["SAR"] else "SHORT (price below SAR)")
print(f"Trailing stop sits at {last['SAR']:.2f}.")
