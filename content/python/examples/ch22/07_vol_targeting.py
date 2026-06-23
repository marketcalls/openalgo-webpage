# Volatility targeting: size each position by target_vol / realised_vol.
import os
from datetime import datetime, timedelta

import numpy as np

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)

# Realised vol = annualised std dev of daily returns over 20 days.
daily_ret = df["close"].pct_change()
realised_vol = daily_ret.rolling(20).std() * np.sqrt(252)

# Aim for a steady 15% portfolio volatility. Quiet stock -> bigger position; wild stock -> smaller.
target_vol = 0.15
raw_size = target_vol / realised_vol
position = raw_size.clip(upper=3.0)  # cap leverage at 3x for safety

capital = 200000
last_price = df["close"].iloc[-1]
shares = int((capital * position.iloc[-1]) / last_price)

print(f"Realised volatility: {realised_vol.iloc[-1] * 100:.1f}%   target: {target_vol * 100:.0f}%")
print(f"Volatility-scaled size factor: {position.iloc[-1]:.2f}x")
print(f"At Rs {last_price:.1f}, that is about {shares} shares on Rs {capital:,} capital.")
print("\nVol targeting keeps risk roughly CONSTANT across calm and stormy markets.")
