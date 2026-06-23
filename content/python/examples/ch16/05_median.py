# Rolling Median: a "middle" price that ignores spikes and outliers.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)

# The median is the middle value of a window. Unlike the average, one freak
# spike can't drag it around - useful when data is noisy.
df["MEDIAN"] = ta.median(df["close"], 5)
df["MEAN"] = df["close"].rolling(5).mean()

print(df[["close", "MEDIAN", "MEAN"]].tail(5).round(2))
print(f"\nLatest 5-day median: {df['MEDIAN'].iloc[-1]:.2f}")
print(f"Latest 5-day mean  : {df['MEAN'].iloc[-1]:.2f}")
print("The median sits near the typical price even when a single day spikes.")
