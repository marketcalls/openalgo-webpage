# Aroon Oscillator: how recently did we make a new high vs a new low?
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# Aroon Oscillator = Aroon Up minus Aroon Down. Bounded -100..+100 (uses high & low, no close).
df["AROON_OSC"] = ta.aroon_oscillator(df["high"], df["low"], period=14)

osc = df["AROON_OSC"].iloc[-1]
print(df[["close", "AROON_OSC"]].tail(5).round(1))
print(f"\nLatest Aroon Oscillator: {osc:+.1f}")
print("Trend:", "strong up (recent new highs)" if osc > 50
      else "strong down (recent new lows)" if osc < -50 else "weak / no clear trend")
