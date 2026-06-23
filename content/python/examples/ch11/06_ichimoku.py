# Ichimoku Cloud: five lines that map trend, support and resistance at a glance.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# Returns FIVE series: conversion, base, span A, span B, lagging.
conv, base, span_a, span_b, lag = ta.ichimoku(df["high"], df["low"], df["close"])

price = df["close"].iloc[-1]
cloud_top = max(span_a.iloc[-1], span_b.iloc[-1])
cloud_bot = min(span_a.iloc[-1], span_b.iloc[-1])

print("ICICIBANK close:", round(price, 2))
print("Conversion line:", round(conv.iloc[-1], 2))
print("Base line      :", round(base.iloc[-1], 2))
print(f"Cloud          : {cloud_bot:.2f} to {cloud_top:.2f}")

if price > cloud_top:
    print("Read: price ABOVE the cloud -> bullish regime")
elif price < cloud_bot:
    print("Read: price BELOW the cloud -> bearish regime")
else:
    print("Read: price INSIDE the cloud -> no clear trend")
