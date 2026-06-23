# ADX: how STRONG is the trend (regardless of direction)?
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)

# ADX returns a TUPLE: (+DI, -DI, ADX). ADX measures strength; +DI/-DI give direction.
di_plus, di_minus, adx = ta.adx(df["high"], df["low"], df["close"], period=14)
df["ADX"] = adx
df["DI+"] = di_plus
df["DI-"] = di_minus

a = df["ADX"].iloc[-1]
print(df[["close", "DI+", "DI-", "ADX"]].tail(5).round(1))
print(f"\nLatest ADX: {a:.1f}")
print("Trend strength:", "strong (>25)" if a > 25 else "weak / ranging (<20)" if a < 20 else "developing")
print("Direction:", "up (+DI leads)" if df["DI+"].iloc[-1] > df["DI-"].iloc[-1] else "down (-DI leads)")
