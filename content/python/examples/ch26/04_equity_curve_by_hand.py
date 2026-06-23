# Step 4: compound the daily returns into an equity curve and compare to buy-and-hold.
import datetime
import os

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="SBIN", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
position = (ta.ema(close, 10) > ta.ema(close, 30)).astype(int).shift(1).fillna(0)
strategy_ret = position * close.pct_change().fillna(0)

start_cash = 100000
# (1 + r).cumprod() grows the account day by day - the equity curve.
strategy_equity = start_cash * (1 + strategy_ret).cumprod()
buyhold_equity = start_cash * (1 + close.pct_change().fillna(0)).cumprod()

print(f"Start cash        : {start_cash:,}")
print(f"Strategy end value: {strategy_equity.iloc[-1]:,.0f}")
print(f"Buy & hold value  : {buyhold_equity.iloc[-1]:,.0f}")
print(f"Strategy return   : {(strategy_equity.iloc[-1] / start_cash - 1) * 100:.2f}%")
print(f"Buy & hold return : {(buyhold_equity.iloc[-1] / start_cash - 1) * 100:.2f}%")
print("\nNote: this hand-rolled curve ignores trading costs - we add those next "
      "with VectorBT.")
