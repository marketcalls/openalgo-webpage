# The rupee scale of the arena: average daily traded value of a few heavyweight names.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")
basket = ["RELIANCE", "HDFCBANK", "ICICIBANK", "SBIN", "TCS", "INFY"]

total_cr = 0.0
print("Average daily traded value over the last year (close x volume):")
for sym in basket:
    df = client.history(symbol=sym, exchange="NSE", interval="D",
                        start_date=start, end_date=end).tail(250)
    adtv_cr = (df["close"] * df["volume"]).mean() / 1e7  # rupees -> crore
    total_cr += adtv_cr
    print(f"  {sym:<10} Rs {adtv_cr:8.0f} crore/day")

print(f"\nJust {len(basket)} names turn over about Rs {total_cr:,.0f} crore every single day.")
print("This is the rupee ocean that buy-side, sell-side, prop and HFT desks all swim in.")
