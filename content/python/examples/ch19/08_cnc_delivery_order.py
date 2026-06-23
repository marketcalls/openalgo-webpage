# Acting on a signal: place a delivery (CNC) buy. Safe to run -- server is in analyze mode.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Re-check the regime, then only buy if the golden cross is in force.
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")
df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)
close = df["close"]
bullish = ta.sma(close, 50).iloc[-1] > ta.sma(close, 200).iloc[-1]

if bullish:
    resp = client.placeorder(
        strategy="GoldenCross",
        symbol="SBIN",
        action="BUY",
        exchange="NSE",
        price_type="MARKET",
        product="CNC",   # delivery -- this is a multi-week hold
        quantity=1,
    )
    print("Regime bullish -- placed CNC buy:", resp.get("status"), resp.get("orderid"))
else:
    print("Regime not bullish -- staying flat, no order placed.")
