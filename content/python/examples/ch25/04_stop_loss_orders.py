# Stop orders that protect a position: SL (stop-limit) and SL-M (stop-market).
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# SL = Stop-Loss LIMIT. When price hits trigger_price (24820), a SELL LIMIT at
# price (24800) is sent. Use on an NFO future (NRML = overnight carry).
sl = client.placeorder(
    strategy="Chapter25", symbol="NIFTY30JUN26FUT", exchange="NFO",
    action="SELL", price_type="SL", product="NRML",
    quantity=65, price=24800, trigger_price=24820,
)
print(f"SL   order id: {sl.get('orderid')}  status: {sl['status']}")

# SL-M = Stop-Loss MARKET. Only a trigger is needed; once hit it fills at market.
slm = client.placeorder(
    strategy="Chapter25", symbol="GOLDM03JUL26FUT", exchange="MCX",
    action="SELL", price_type="SL-M", product="NRML",
    quantity=1, trigger_price=140000,
)
print(f"SL-M order id: {slm.get('orderid')}  status: {slm['status']}")
