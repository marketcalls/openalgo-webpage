import os

from openalgo import api

# The OpenAlgo SDK wraps the REST calls for you - cleaner than raw requests.
client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# history() hands back a ready-made pandas DataFrame - no JSON to unpack.
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date="2026-06-10", end_date="2026-06-24")

print("Rows:", len(df))
print(df[["open", "high", "low", "close", "volume"]].tail(3).round(2))
