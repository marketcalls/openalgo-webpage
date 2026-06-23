# NATR is ATR as a % of price -- so you can compare risk across very different symbols.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")

# Compare a stock and a commodity on the SAME volatility scale.
for sym, exch in [("RELIANCE", "NSE"), ("GOLDM03JUL26FUT", "MCX")]:
    df = client.history(symbol=sym, exchange=exch, interval="D", start_date=start, end_date=end)
    natr = ta.natr(df["high"], df["low"], df["close"], 14).iloc[-1]
    print(f"{sym:18s} NATR(14) = {natr:5.2f}%  -> price swings ~{natr:.2f}% in a typical day")

# Volatility-based sizing: risk a fixed 1% of capital, let NATR set the quantity.
print("\nIdea: the higher the NATR, the SMALLER the position, so rupee-risk stays steady.")
