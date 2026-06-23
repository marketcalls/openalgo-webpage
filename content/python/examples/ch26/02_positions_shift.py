# Step 2: the .shift(1) that stops you from cheating (trading on today's close).
import datetime
import os

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="SBIN", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
signal = (ta.ema(close, 10) > ta.ema(close, 30)).astype(int)

# You only SEE today's signal after today's close, so you can only act on it
# TOMORROW. shift(1) moves the signal forward one bar = the position you hold.
position = signal.shift(1).fillna(0)

print("Signal today vs position held (note the one-day lag):")
preview = close.to_frame("close")
preview["signal"] = signal
preview["position"] = position
print(preview.tail(6).to_string())
print("\nWithout shift(1) you would be 'buying the close you already saw' "
      "- a classic look-ahead bug that fakes great results.")
