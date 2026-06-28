# Realized volatility from 5m intraday bars vs a plain close-to-close estimate, for NIFTY.
import os
from datetime import datetime

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="5m",
                    start_date="2026-03-01", end_date=end)

px = df["close"]
day = px.index.normalize()                                  # session date for each bar

# Intraday 5m log returns WITHIN each session (groupby drops the overnight gap)
logret = np.log(px).groupby(day).diff().dropna()
rv_day = (logret ** 2).groupby(logret.index.normalize()).sum()   # realized variance per day

ann_rv = np.sqrt(rv_day.mean() * 252) * 100                 # annualised realized vol (intraday, open-to-close)

# Plain close-to-close: one daily return per session, then its sample volatility
daily_close = px.groupby(day).last()
cc_ret = np.log(daily_close).diff().dropna()
ann_cc = cc_ret.std() * np.sqrt(252) * 100                  # annualised close-to-close vol (includes overnight)

n_days = int(rv_day.shape[0])
bars = int(logret.groupby(logret.index.normalize()).size().median())

print(f"NIFTY realized vs close-to-close volatility  ({n_days} sessions, ~{bars} five-min returns/day)")
print(f"  Realized vol (5m intraday, open-to-close) : {ann_rv:5.1f}%  annualised")
print(f"  Close-to-close vol (daily)                : {ann_cc:5.1f}%  annualised")
print(f"  Gap (overnight + sampling difference)     : {ann_cc - ann_rv:+5.1f} pts")
print(f"SUMMARY: 5m realized vol {ann_rv:.1f}% vs close-to-close {ann_cc:.1f}% annualised "
      f"({n_days} sessions); the {ann_cc - ann_rv:+.1f} pt gap is risk the intraday measure misses.")
