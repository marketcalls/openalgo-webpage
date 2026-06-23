# .describe() and friends summarise a whole column in one line.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

df["ret_pct"] = df["close"].pct_change() * 100      # daily returns in percent

# describe() gives count, mean, std (volatility), min, quartiles and max at once.
print("Daily return summary (%):")
print(df["ret_pct"].describe().round(3))

# Annualised volatility: daily std (in %) scaled by the square root of ~252 trading days.
ann_vol = df["ret_pct"].std() * (252 ** 0.5)
print("\nAnnualised volatility:", round(ann_vol, 1), "%")
