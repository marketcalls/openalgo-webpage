# Step 3: strategy return = market return ONLY on days you held a position.
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

# Daily % change of the stock.
market_ret = close.pct_change().fillna(0)
# You earn the day's move only when position == 1 (you were long).
strategy_ret = position * market_ret

print(f"Average daily market return  : {market_ret.mean() * 100:.3f}%")
print(f"Average daily strategy return: {strategy_ret.mean() * 100:.3f}%")
print(f"Days in the market: {int((position == 1).sum())} of {len(position)}")
print("On flat days the strategy return is 0 - cash earns nothing, "
      "but it also can't lose.")
