# search() finds tradable symbols when you do not know the exact name.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

result = client.search(query="NIFTY FUT", exchange="NFO")
print("Matches found:", result.get("message"))
for item in result["data"][:5]:
    print(f"{item['symbol']:22s} expiry {item['expiry']}  lot {item['lotsize']}")
