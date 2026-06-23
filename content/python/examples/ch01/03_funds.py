# Read your trading account balance (funds and margins).
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

funds = client.funds()
data = funds["data"]
print("Available cash :", data["availablecash"])
print("Utilised       :", data["utiliseddebits"])
print("Realised P&L   :", data.get("m2mrealized"))
print("Unrealised P&L :", data.get("m2munrealized"))
