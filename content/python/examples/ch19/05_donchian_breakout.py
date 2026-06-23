# Donchian channel breakout: buy a close above the 20-day high, exit below the 20-day low.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

# donchian returns three Series: upper (highest high), middle, lower (lowest low).
upper, middle, lower = ta.donchian(df["high"], df["low"], period=20)

close = df["close"].iloc[-1]
# Compare to the channel as it stood YESTERDAY ([-2]) so today's bar can break it.
upper_prev = np.asarray(upper)[-2]
lower_prev = np.asarray(lower)[-2]

print("Latest close :", round(float(close), 2))
print("20-day upper (prior bar):", round(float(upper_prev), 2))
print("20-day lower (prior bar):", round(float(lower_prev), 2))
if close > upper_prev:
    print("Signal: BREAKOUT -- close cleared the 20-day high.")
elif close < lower_prev:
    print("Signal: BREAKDOWN -- close broke the 20-day low.")
else:
    print("Signal: inside the channel -- no trade.")
