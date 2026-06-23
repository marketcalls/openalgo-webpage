# Ease of Movement (EMV): how little volume it took to move price.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="CRUDEOIL20JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# EMV uses high, low and volume (not close). High positive EMV = price rose easily
# on light volume; near zero = it took heavy volume to budge.
df["EMV"] = ta.emv(df["high"], df["low"], df["volume"], length=14)

emv = df["EMV"].iloc[-1]
print(df[["close", "volume", "EMV"]].tail(5).round(2))
print(f"\nLatest EMV: {emv:+.2f}")
print("Reading:", "rising easily (low effort up-move)" if emv > 0
      else "falling easily (low effort down-move)")
