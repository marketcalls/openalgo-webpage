# Diversification: combine assets and portfolio risk falls below the average. A free lunch.
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
start = (datetime.now() - timedelta(days=730)).strftime("%Y-%m-%d")
syms = ["RELIANCE", "INFY", "HDFCBANK", "ITC"]

rets = pd.DataFrame({s: client.history(symbol=s, exchange="NSE", interval="D",
                                       start_date=start, end_date=end)["close"].pct_change()
                     for s in syms}).dropna()


def ann_vol(x):
    return x.std() * np.sqrt(252) * 100


print("Individual annualised volatility:")
for s in syms:
    print(f"  {s:10s}: {ann_vol(rets[s]):.1f}%")

print(f"\nAverage of the individual vols : {np.mean([ann_vol(rets[s]) for s in syms]):.1f}%")
port = rets @ np.repeat(1 / len(syms), len(syms))          # equal-weight portfolio
print(f"Equal-weight PORTFOLIO vol     : {ann_vol(port):.1f}%   <- lower, because they aren't perfectly correlated")
print("\nThat reduction in risk, for free, is the only genuine free lunch in finance.")
