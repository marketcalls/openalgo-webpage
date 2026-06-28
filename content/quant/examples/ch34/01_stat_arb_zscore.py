# A micro stat-arb signal: spread z-score on two related Nifty bank names at 1m.
import os

import numpy as np
import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

A, B = "HDFCBANK", "ICICIBANK"
start, end = "2026-06-16", "2026-06-27"
ca = client.history(symbol=A, exchange="NSE", interval="1m", start_date=start, end_date=end)["close"]
cb = client.history(symbol=B, exchange="NSE", interval="1m", start_date=start, end_date=end)["close"]

px = pd.concat([ca, cb], axis=1, keys=[A, B]).dropna()
ret_corr = px[A].pct_change().corr(px[B].pct_change())

# hedge ratio from a simple OLS fit, then the spread and its rolling z-score
beta = np.polyfit(px[B], px[A], 1)[0]
spread = px[A] - beta * px[B]
win = 60
z = (spread - spread.rolling(win).mean()) / spread.rolling(win).std()
px = px.assign(spread=spread, z=z).dropna()

extreme = px[px["z"].abs() >= 2.0].copy()
extreme["signal"] = np.where(extreme["z"] >= 2, "short spread (sell A / buy B)",
                             "long spread (buy A / sell B)")

print(f"Pair {A} vs {B} on 1m bars : {len(px)} usable bars, return corr {ret_corr:.2f}")
print(f"Hedge ratio A = {beta:.3f} * B, z window {win} bars, current z = {px['z'].iloc[-1]:+.2f}")
print(f"Extreme bars |z| >= 2 : {len(extreme)}  ({100*len(extreme)/len(px):.1f}% of the session)")
print("\nLast 5 entry candidates:")
print(extreme[["z", "signal"]].tail(5).round(2).to_string())
