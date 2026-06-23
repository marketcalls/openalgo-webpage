# List comprehensions transform data in one readable line.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

df = client.history(symbol="SBIN", exchange="NSE", interval="D",
                    start_date="2026-06-01", end_date="2026-06-22")

closes = df["close"].tolist()
daily_change = [round(b - a, 2) for a, b in zip(closes, closes[1:])]
up_days = [c for c in daily_change if c > 0]

print("Last 5 closes :", closes[-5:])
print("Daily changes :", daily_change[-5:])
print("Up days       :", len(up_days), "of", len(daily_change))
