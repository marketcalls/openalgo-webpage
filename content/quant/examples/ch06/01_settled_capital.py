# The capital the settlement system moves - your funds, settled and available to trade.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

data = client.funds()["data"]
print(f"Available cash : {float(data['availablecash']):>14,.2f}")
print(f"Utilised       : {float(data['utiliseddebits']):>14,.2f}")
print(f"Realised P&L   : {float(data.get('m2mrealized', 0)):>14,.2f}")
print(f"Collateral     : {float(data.get('collateral', 0)):>14,.2f}")
print("\nThis cash is exactly what flows through clearing and settles to/from your bank on T+1.")
print("A quant tracks settled vs available capital - it decides how much can actually be deployed.")
