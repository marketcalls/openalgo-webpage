# Linear Regression line + slope: fit a straight line to price and read its tilt.
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

# linreg fits a least-squares line; its endpoint is the "fair value" for that bar.
df["LINREG"] = ta.linreg(df["close"], 20)
# lrslope is the tilt of that line: positive = rising trend, negative = falling.
df["SLOPE"] = ta.lrslope(df["close"], period=20)

print(df[["close", "LINREG", "SLOPE"]].tail(5).round(2))
slope = df["SLOPE"].iloc[-1]
print(f"\nLatest slope: {slope:+.3f}")
print("Trend:", "up" if slope > 0 else "down" if slope < 0 else "flat")
gap = df["close"].iloc[-1] - df["LINREG"].iloc[-1]
print(f"Price is {gap:+.2f} vs its regression line ({'above' if gap > 0 else 'below'}).")
