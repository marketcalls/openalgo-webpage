# Safety first: never send an options order until analyze mode is confirmed ON.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

status = client.analyzerstatus()
mode = status["data"]["analyze_mode"]

print("Analyzer status:", status["data"])
if mode:
    print("\nAnalyze mode is ON -- option orders are SIMULATED. Safe to practise.")
else:
    print("\nWARNING: LIVE mode. Orders would hit the real exchange. Stop here.")
