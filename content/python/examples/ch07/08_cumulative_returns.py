# Chain daily returns into a growth curve with .cumprod().
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

df["ret"] = df["close"].pct_change().fillna(0)

# Each day multiplies the running balance by (1 + that day's return).
df["growth"] = (1 + df["ret"]).cumprod()       # 1.0 = starting value
df["equity"] = 100000 * df["growth"]           # what 1,00,000 would have become

print(df[["close", "growth", "equity"]].tail(4).round(2))

total = (df["growth"].iloc[-1] - 1) * 100
print(f"\nBuy-and-hold over {len(df)} sessions: {round(total, 2)}%")
