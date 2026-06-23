# Keltner Channel uses ATR, not std-dev. Compared to Bollinger, it spots the "squeeze".
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)

# Keltner returns (upper, middle, lower).
kc_up, kc_mid, kc_low = ta.keltner(df["high"], df["low"], df["close"])
# Bollinger for comparison.
bb_up, _, bb_low = ta.bbands(df["close"])

price = df["close"].iloc[-1]
print("SBIN close   :", round(price, 2))
print(f"Keltner upper/lower: {kc_up.iloc[-1]:.2f} / {kc_low.iloc[-1]:.2f}")
print(f"Bollinger upper/lower: {bb_up.iloc[-1]:.2f} / {bb_low.iloc[-1]:.2f}")

# The squeeze: Bollinger bands narrower than the Keltner channel = very low volatility.
squeeze = bb_up.iloc[-1] < kc_up.iloc[-1] and bb_low.iloc[-1] > kc_low.iloc[-1]
print("Squeeze (BB inside KC)?", "YES -- volatility coiled, breakout watch" if squeeze else "no")
