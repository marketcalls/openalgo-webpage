# Option format: [Base][Expiry][Strike][CE/PE]  e.g. NIFTY30JUN2624000CE
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

result = client.search(query="NIFTY 24000 CE", exchange="NFO")
for item in result["data"][:5]:
    print(f"{item['symbol']:24s} strike {item['strike']:>7}  expiry {item['expiry']}")
