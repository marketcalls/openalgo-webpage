# The crowd's fear, measured: how NIFTY returns move against India VIX.
import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")

nifty = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date=start, end_date=end)["close"]
vix = client.history(symbol="INDIAVIX", exchange="NSE_INDEX", interval="D",
                     start_date=start, end_date=end)["close"]

# Align: NIFTY daily return vs same-day change in India VIX (the "price of fear").
df = pd.concat([nifty.pct_change(), vix.pct_change(), vix.diff()], axis=1).dropna()
df.columns = ["nifty_ret", "vix_pct", "vix_pts"]

corr = df["nifty_ret"].corr(df["vix_pct"])
slope = np.polyfit(df["nifty_ret"], df["vix_pts"], 1)[0]  # VIX points per 1.0 of NIFTY return

down = df[df["nifty_ret"] < 0]["vix_pts"].mean()   # avg VIX move on red days
up = df[df["nifty_ret"] > 0]["vix_pts"].mean()     # avg VIX move on green days

print(f"Window: {len(df)} trading days, {df.index[0].date()} to {df.index[-1].date()}")
print(f"India VIX latest close   : {vix.iloc[-1]:.2f}  (annualised expected move)")
print(f"Corr(NIFTY ret, VIX chg) : {corr:+.3f}   <- the inverse 'price of fear'")
print(f"Sensitivity              : a -1% NIFTY day lifts VIX by ~{-slope/100:.3f} pts")
print(f"Avg VIX change, red days : {down:+.3f} pts")
print(f"Avg VIX change, green days: {up:+.3f} pts   <- fear rises faster than it falls")
