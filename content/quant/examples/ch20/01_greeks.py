# Black-76 Greeks on a Nifty option - the numbers that say how it breathes.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# OpenAlgo computes Greeks with Black-76, priced off the synthetic-future FORWARD.
g = client.optiongreeks(symbol="NIFTY30JUN2624000CE", exchange="NFO", interest_rate=0.0,
                        underlying_symbol="NIFTY", underlying_exchange="NSE_INDEX")
gk = g["greeks"]

print(f"Option : {g['symbol']}   price {g['option_price']}")
print(f"Forward: {g['spot_price']:.2f}  (the synthetic future)   IV: {g['implied_volatility']}%\n")
print(f"  Delta  {gk['delta']:+.3f}   moves this much per 1 point of the forward")
print(f"  Gamma  {gk['gamma']:.5f}   how fast delta itself changes")
print(f"  Vega   {gk['vega']:+.2f}    gained per +1% in implied volatility")
print(f"  Theta  {gk['theta']:+.2f}   lost every day to time decay")
print(f"  Rho    {gk['rho']:+.3f}")
print("\nThese are Black-76 Greeks - the correct model for Indian F&O, priced off the forward (not spot).")
