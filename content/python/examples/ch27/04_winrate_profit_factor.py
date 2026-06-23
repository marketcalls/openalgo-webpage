# Win rate and profit factor: how OFTEN you win vs how MUCH you win.
import datetime
import os

import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))
pf = vbt.Portfolio.from_signals(close, entries, exits,
                                init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")
trades = pf.trades

# Profit factor = gross profit / gross loss. Above 1 means the wins outweigh
# the losses. A trend system often wins LESS than half its trades yet still
# profits, because the few wins are far bigger than the many small losses.
print(f"Total trades : {trades.count()}")
print(f"Win rate     : {trades.win_rate() * 100:.1f}%")
print(f"Profit factor: {trades.profit_factor():.2f}  (>1 = profitable)")
print("Don't chase a high win rate alone - many tiny wins can be wiped by one big loss.")
