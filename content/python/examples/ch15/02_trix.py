# TRIX: a triple-smoothed momentum oscillator that filters out noise.
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

# TRIX = rate of change of a triple-EMA-smoothed price. Heavy smoothing = few false signals.
df["TRIX"] = ta.trix(df["close"], 15)

trix = df["TRIX"].iloc[-1]
prev = df["TRIX"].iloc[-2]
print(df[["close", "TRIX"]].tail(5).round(4))
print(f"\nLatest TRIX(15): {trix:+.4f}")
print("Momentum:", "positive (above zero)" if trix > 0 else "negative (below zero)")
# A zero-line cross is the classic TRIX signal.
print("Crossed zero this bar:", (prev <= 0 < trix) or (prev >= 0 > trix))
