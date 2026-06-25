import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

q = client.quotes(symbol="RELIANCE", exchange="NSE")["data"]

print("RELIANCE - a full quote:")
for field in ["ltp", "prev_close", "open", "high", "low", "bid", "ask", "volume"]:
    print(f"  {field:<11}: {q.get(field)}")
