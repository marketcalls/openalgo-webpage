# Backtest an intraday EMA system on the NIFTY future with VectorBT.
import os
import time
from datetime import datetime, timedelta

import pandas as pd

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=20)).strftime("%Y-%m-%d")


def hist():
    for _ in range(3):
        d = client.history(symbol="NIFTY30JUN26FUT", exchange="NFO", interval="5m",
                           start_date=start, end_date=end)
        if isinstance(d, pd.DataFrame) and "close" in d:
            return d
        time.sleep(1)
    raise RuntimeError(f"Could not fetch history: {d}")


df = hist()
close = df["close"]
entries = pd.Series(ta.crossover(ta.ema(close, 9), ta.ema(close, 21)), index=close.index)
exits = pd.Series(ta.crossunder(ta.ema(close, 9), ta.ema(close, 21)), index=close.index)

# Square off every position on the last bar of each session (no overnight risk).
day = pd.Series(df.index.normalize(), index=df.index)
exits = exits | (day != day.shift(-1))

import vectorbt as vbt

# Reset to a simple integer index so VectorBT ignores the overnight gaps between sessions.
pf = vbt.Portfolio.from_signals(
    close.reset_index(drop=True), entries.reset_index(drop=True), exits.reset_index(drop=True),
    init_cash=500000, fees=0.0003,
)
print("NIFTY future intraday EMA 9/21 (5m, square-off each day)")
print("Total return :", round(float(pf.total_return()) * 100, 2), "%")
print("Trades       :", int(pf.trades.count()))
print("Win rate     :", round(float(pf.trades.win_rate()) * 100, 1), "%")
print("\nA losing result on a few weeks of data is normal -- intraday edges are thin and costs bite.")
