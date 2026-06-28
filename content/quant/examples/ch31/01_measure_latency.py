# How fast is YOUR setup? Time a round trip to the market and compare to HFT.
import os
import statistics
import time

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

latencies = []
for _ in range(20):
    t0 = time.perf_counter()
    client.quotes(symbol="RELIANCE", exchange="NSE")     # one round trip to the market
    latencies.append((time.perf_counter() - t0) * 1000)  # in milliseconds
    time.sleep(0.6)                                       # space calls out so rate limits don't skew the timing

latencies.sort()
p95 = latencies[int(len(latencies) * 0.95) - 1]
print(f"Round trips : {len(latencies)}")
print(f"Fastest     : {min(latencies):.1f} ms")
print(f"Median      : {statistics.median(latencies):.1f} ms")
print(f"95th pct    : {p95:.1f} ms")
print(f"Slowest     : {max(latencies):.1f} ms")
print("\nAn HFT firm colocated at the exchange measures this in MICROSECONDS - thousands of times faster.")
