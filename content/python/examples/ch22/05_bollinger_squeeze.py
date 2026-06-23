# Bollinger squeeze: spot low-volatility coils, then trade the expansion.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)

# Bandwidth = how wide the Bollinger Bands are. Low bandwidth = a quiet "squeeze";
# the band then expands when a move finally breaks out.
df["bbwidth"] = ta.bbwidth(df["close"], period=20, std_dev=2.0)

# A squeeze: bandwidth in the bottom 20% of its recent range.
floor = df["bbwidth"].rolling(60).quantile(0.20)
df["squeeze"] = df["bbwidth"] < floor

print(df[["close", "bbwidth", "squeeze"]].dropna().tail(6).round(4))
print("\nSqueeze days in the window:", int(df["squeeze"].sum()))
print("Quiet bands tend to precede big moves -- arm a breakout order when a squeeze appears.")
