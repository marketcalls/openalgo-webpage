# Backtest a seasonal rule: be long ONLY on historically strong weekdays.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D", start_date=start, end_date=end)

df["ret"] = df["close"].pct_change().fillna(0)
# Step 1: learn which weekdays were positive on average.
strong = df.groupby(df.index.dayofweek)["ret"].mean()
strong_days = strong[strong > 0].index.tolist()
names = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri"}
print("Strong weekdays (held):", [names[d] for d in strong_days])

# Step 2: the rule earns the day's return only when that weekday is "strong".
in_market = df.index.dayofweek.isin(strong_days)
df["strategy"] = df["ret"].where(in_market, 0.0)

# Step 3: compound both equity curves from a notional 100.
buy_hold = (1 + df["ret"]).cumprod() * 100
seasonal = (1 + df["strategy"]).cumprod() * 100
print("\nBuy & hold final value :", round(buy_hold.iloc[-1], 1))
print("Seasonal rule final    :", round(seasonal.iloc[-1], 1))
print("Days in market         :", int(in_market.sum()), "of", len(df))
