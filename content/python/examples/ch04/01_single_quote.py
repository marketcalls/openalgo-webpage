# A full quote snapshot: every field the server returns for one symbol.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

q = client.quotes(symbol="SBIN", exchange="NSE")["data"]
for field, value in q.items():
    print(f"{field:12s}: {value}")
