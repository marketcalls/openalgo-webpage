# Combine three trend tools into one verdict -- the seed of a real trend filter.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")

df = client.history(symbol="CRUDEOIL20JUL26FUT", exchange="MCX", interval="1h", start_date=start, end_date=end)

price = df["close"].iloc[-1]
ema50 = ta.ema(df["close"], 50).iloc[-1]
_, st_dir = ta.supertrend(df["high"], df["low"], df["close"])
sar = ta.psar(df["high"], df["low"]).iloc[-1]

votes = {
    "Price > EMA50": price > ema50,
    "Supertrend up": st_dir.iloc[-1] == -1,
    "Price > PSAR": price > sar,
}
score = sum(votes.values())

print("CRUDEOIL close:", round(price, 2))
for name, ok in votes.items():
    print(f"  {name:16s}: {'yes' if ok else 'no'}")
print(f"Bullish votes: {score}/3 ->",
      "go with longs" if score >= 2 else "favour shorts / stand aside")
