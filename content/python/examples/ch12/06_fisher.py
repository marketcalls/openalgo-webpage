# Fisher Transform: sharpens price into clear peaks so turns are easy to spot.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

# Returns a TUPLE: fisher line and its trigger (the previous fisher value).
fisher, trigger = ta.fisher(df["high"], df["low"], length=9)

f = fisher.iloc[-1]
t = trigger.iloc[-1]
print("INFY close :", round(df["close"].iloc[-1], 2))
print(f"Fisher     : {f:7.3f}")
print(f"Trigger    : {t:7.3f}")

# A turn up through the trigger after a deep negative reading often marks a low.
print("Stretch:", "high (possible top)" if f > 1.5 else "low (possible bottom)" if f < -1.5 else "neutral")
print("Turn:", "fisher above trigger -> turning up" if f > t else "fisher below trigger -> turning down")
