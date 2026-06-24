# The volatility risk premium: implied vol usually exceeds what actually happens.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Implied: what options price in (India VIX, ~30-day forward-looking).
vix = client.quotes(symbol="INDIAVIX", exchange="NSE_INDEX")["data"]["ltp"]

# Realized: what the market actually did over the last 30 sessions.
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date=start, end_date=end)["close"].pct_change().dropna()
realized = r.tail(30).std() * (252 ** 0.5) * 100

print(f"Implied volatility (India VIX) : {vix:.2f}%")
print(f"Realized volatility (last 30d) : {realized:.2f}%")
print(f"Volatility risk premium        : {vix - realized:+.2f}%")
print("\nImplied usually exceeds realized - the premium that option SELLERS harvest for bearing risk.")
print("Like insurance: buyers overpay for protection on average, sellers collect it - until a crash.")
