# Elder Force Index: price change times volume = the "force" behind a move.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# Force Index multiplies the day's price change by its volume, then EMA-smooths it.
df["FI"] = ta.force_index(df["close"], df["volume"], length=13)

fi = df["FI"].iloc[-1]
print(df[["close", "volume", "FI"]].tail(5).round(0))
print(f"\nLatest Force Index: {fi:+,.0f}")
print("Sign:", "positive - bulls have the force" if fi > 0 else "negative - bears have the force")
# A fresh cross from negative to positive often flags a momentum shift.
crossed_up = df["FI"].iloc[-2] < 0 < df["FI"].iloc[-1]
print("Just crossed up through zero:", crossed_up)
