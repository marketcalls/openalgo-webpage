# CCI and Williams %R: two more overbought/oversold gauges, tested on MCX silver.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")

df = client.history(symbol="SILVERM30JUN26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

cci = ta.cci(df["high"], df["low"], df["close"], 20).iloc[-1]
wr = ta.williams_r(df["high"], df["low"], df["close"], 14).iloc[-1]

print("SILVERM close:", round(df["close"].iloc[-1], 1))
print(f"CCI(20)      : {cci:8.2f}")
print("  ->", "strong up (>+100)" if cci > 100 else "strong down (<-100)" if cci < -100 else "ranging (-100..+100)")
print(f"Williams %R  : {wr:8.2f}")
print("  ->", "overbought (>-20)" if wr > -20 else "oversold (<-80)" if wr < -80 else "mid-range")
