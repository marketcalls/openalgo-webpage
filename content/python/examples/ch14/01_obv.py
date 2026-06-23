# On Balance Volume (OBV): does volume confirm the price trend?
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

# OBV adds volume on up-close days and subtracts it on down-close days.
df["OBV"] = ta.obv(df["close"], df["volume"])
print("ta.obv returns a", type(df["OBV"]).__name__)

# Is OBV trending the same way as price over the last 10 sessions?
price_chg = df["close"].iloc[-1] - df["close"].iloc[-11]
obv_chg = df["OBV"].iloc[-1] - df["OBV"].iloc[-11]
print(df[["close", "volume", "OBV"]].tail(5).round(2))
print(f"\n10-day price change: {price_chg:+.2f}")
print(f"10-day OBV change  : {obv_chg:+,.0f}")
print("Verdict:", "volume confirms the move" if (price_chg > 0) == (obv_chg > 0)
      else "DIVERGENCE - volume disagrees with price")
