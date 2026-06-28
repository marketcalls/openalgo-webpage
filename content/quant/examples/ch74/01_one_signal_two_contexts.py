# One signal, two contexts: the SAME signal(df) runs the backtest and the live decision.
import os
from datetime import datetime

import numpy as np
import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# --- CONFIG: parameters live in one place, shared by backtest and live ---
CONFIG = {"fast": 20, "slow": 50, "live_window": 250}


def signal(df, fast=CONFIG["fast"], slow=CONFIG["slow"]):
    """Vectorised position: +1 long when fast SMA > slow SMA, else -1 short.
    This is the ONLY copy of the logic. Backtest and live both call it."""
    close = df["close"]
    pos = pd.Series(np.where(ta.sma(close, fast) > ta.sma(close, slow), 1, -1),
                    index=df.index)
    return pos


end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2023-01-01", end_date=end)

# --- BACKTEST: apply the signal across the full history ---
bt = signal(df)
trades = int((bt.diff() != 0).sum()) - 1                 # number of position flips
bt_decision = int(bt.iloc[-1])

# --- LIVE: the bot holds only a trailing window in memory, not all of history ---
window = df.tail(CONFIG["live_window"])                   # what a live process keeps
live_decision = int(signal(window).iloc[-1])             # decide on the latest bar

# --- PARITY: identical code path must give an identical answer ---
overlap = bt.tail(120)                                   # compare the shared tail
agree_tail = bool((signal(df.tail(CONFIG["live_window"])).tail(120).values
                   == overlap.values).all())

label = {1: "LONG", -1: "SHORT"}
print(f"NIFTY daily {df.index[0].date()} -> {df.index[-1].date()}  ({len(df)} bars)")
print(f"Signal: {CONFIG['fast']}/{CONFIG['slow']} SMA cross  (one signal() function)")
print(f"  Backtest position changes : {trades}")
print(f"  Backtest last bar decision: {label[bt_decision]}  @ {df['close'].iloc[-1]:.2f}")
print(f"  Live  (trailing {CONFIG['live_window']}) decision: {label[live_decision]}")
print(f"  Decisions match           : {bt_decision == live_decision}")
print(f"  Last 120 bars match too   : {agree_tail}")
print("\nSame code, same data, same answer - backtest-live parity by construction.")
