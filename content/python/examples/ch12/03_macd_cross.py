# A MACD crossover is the classic signal. crossover() returns a numpy array of 0/1 flags.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=15)).strftime("%Y-%m-%d")

df = client.history(symbol="NIFTY30JUN26FUT", exchange="NFO", interval="5m", start_date=start, end_date=end)

macd_line, signal_line, _ = ta.macd(df["close"])

# crossover(a, b) -> numpy array, 1 on the bar where a crosses ABOVE b.
bull = ta.crossover(macd_line, signal_line)
bear = ta.crossunder(macd_line, signal_line)

print("NIFTY future 5m bars:", len(df))
print("Bullish MACD crosses:", int(np.nansum(bull)))
print("Bearish MACD crosses:", int(np.nansum(bear)))

last_state = "bullish" if macd_line.iloc[-1] > signal_line.iloc[-1] else "bearish"
print("Current MACD posture:", last_state)
