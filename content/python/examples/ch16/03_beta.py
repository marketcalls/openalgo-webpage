# Beta: how much a stock amplifies the market's moves.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
stock = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)
mkt = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D", start_date=start, end_date=end)

# Beta measures the stock's volatility relative to the market (here NIFTY).
# Beta 1 = moves with the index; >1 = amplifies it; <1 = calmer than the index.
stock["BETA"] = ta.beta(stock["close"], mkt["close"], period=60)

b = stock["BETA"].iloc[-1]
print(stock[["close", "BETA"]].tail(5).round(3))
print(f"\nLatest 60-day Beta vs NIFTY: {b:.2f}")
print("Behaviour:", "amplifies the market (aggressive)" if b > 1.1
      else "tracks the market" if b > 0.9 else "calmer than the market (defensive)")
