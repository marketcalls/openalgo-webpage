# Before placing any order, confirm the server is in analyze mode (simulated).
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

status = client.analyzerstatus()
data = status["data"]

print(f"Mode        : {data['mode']}")
print(f"Analyze mode: {data['analyze_mode']}")

if data["analyze_mode"]:
    print("Safe to practise: every order below is simulated, nothing trades.")
else:
    print("WARNING: live mode is on. Orders would hit the real exchange.")
