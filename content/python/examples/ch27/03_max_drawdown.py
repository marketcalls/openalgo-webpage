# Max drawdown: the worst peak-to-trough fall - the pain you must stomach.
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

# Drawdown is measured from the highest equity peak so far. The max is the
# deepest valley - the loss you'd have lived through at the worst moment.
print(f"Max drawdown : {pf.max_drawdown() * 100:.2f}%")
print(f"Calmar ratio : {pf.calmar_ratio():.2f}  (CAGR divided by max drawdown)")
print("A 50% drawdown needs a 100% gain just to recover - shallow is survivable, "
      "deep can end an account.")
