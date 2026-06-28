# Markets switch between regimes. Classify them and watch returns change completely.
import os
from datetime import datetime

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2019-01-01", end_date=end)
df["ret"] = df["close"].pct_change()
df["sma200"] = df["close"].rolling(200).mean()
df["vol20"] = df["ret"].rolling(20).std() * (252 ** 0.5) * 100      # annualised %
df = df.dropna()

df["trend"] = np.where(df["close"] > df["sma200"], "Bull", "Bear")
df["vol"] = np.where(df["vol20"] > df["vol20"].median(), "Turbulent", "Calm")

print(f"{'REGIME':20s}{'DAYS':>7s}{'AVG DAILY RETURN':>18s}")
for (t, v), g in df.groupby(["trend", "vol"]):
    print(f"{t + ' / ' + v:20s}{len(g):>7d}{g['ret'].mean() * 100:>17.3f}%")

print(f"\nToday's regime: {df['trend'].iloc[-1]} / {df['vol'].iloc[-1]}")
print("Same market, four personalities - a strategy tuned for one can bleed in another.")
