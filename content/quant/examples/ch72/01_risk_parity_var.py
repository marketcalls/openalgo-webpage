# Risk-parity weights from real NSE returns, then the book's 1-day 95% VaR and CVaR.
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
start = (datetime.now() - timedelta(days=1095)).strftime("%Y-%m-%d")
syms = ["RELIANCE", "HDFCBANK", "INFY", "ITC", "TATASTEEL"]

rets = pd.DataFrame({s: client.history(symbol=s, exchange="NSE", interval="D",
                                       start_date=start, end_date=end)["close"].pct_change()
                     for s in syms}).dropna()

# Risk parity (inverse-volatility): each name contributes roughly equal risk,
# so a calm stock gets a bigger rupee weight than a wild one.
vol = rets.std()
w = (1 / vol) / (1 / vol).sum()

port = rets @ w                      # daily portfolio returns
ann_vol = port.std() * np.sqrt(252) * 100

# Historical 1-day 95% VaR / CVaR: VaR is the 5th-percentile loss;
# CVaR (expected shortfall) is the average loss across the whole tail beyond it.
cut = np.percentile(port, 5)
var95 = -cut * 100
cvar95 = -port[port <= cut].mean() * 100
worst = -port.min() * 100

print("Risk-parity (inverse-vol) weights:")
for s in syms:
    print(f"  {s:10s}: {w[s] * 100:5.1f}%")
print(f"\nPortfolio annualised vol  : {ann_vol:.1f}%")
print(f"Historical 1-day 95% VaR  : -{var95:.2f}%")
print(f"Historical 1-day 95% CVaR : -{cvar95:.2f}%")
print(f"Worst single day in window: -{worst:.2f}%")
print(f"\nOn 19 days in 20 the book loses under {var95:.2f}%; when it breaches, it averages {cvar95:.2f}%.")
