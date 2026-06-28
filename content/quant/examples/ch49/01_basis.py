# The basis: how far the future trades from spot - and why no-arbitrage sets it.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

spot = client.quotes(symbol="NIFTY", exchange="NSE_INDEX")["data"]["ltp"]
fut = client.quotes(symbol="NIFTY30JUN26FUT", exchange="NFO")["data"]["ltp"]
basis = fut - spot

print(f"NIFTY spot   : {spot:.2f}")
print(f"NIFTY future : {fut:.2f}")
print(f"Basis (future - spot): {basis:+.2f}   ({'premium' if basis > 0 else 'discount'})")
print(f"As % of spot : {basis / spot * 100:+.2f}%")
print("\nNo-arbitrage ties them: future = spot + cost of carry.")
print("They MUST converge as expiry approaches - if they didn't, it would be free money.")
