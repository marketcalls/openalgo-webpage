# Value at Risk: the loss to expect on a bad day - and the deeper truth beyond it.
import os
from datetime import datetime

import numpy as np
from openalgo import api
from scipy import stats

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2019-01-01", end_date=end)["close"].pct_change().dropna() * 100

hist_var95 = np.percentile(r, 5)                              # 95% VaR from real history
hist_var99 = np.percentile(r, 1)                             # 99% VaR
param_var99 = stats.norm.ppf(0.01, r.mean(), r.std())        # 99% VaR assuming normal
cvar95 = r[r <= hist_var95].mean()                           # expected shortfall

print(f"95% 1-day VaR (historical) : {hist_var95:.2f}%   - lose at least this ~1 day in 20")
print(f"99% 1-day VaR (historical) : {hist_var99:.2f}%   - ~1 day in 100")
print(f"99% 1-day VaR (normal model): {param_var99:.2f}%   - the bell curve UNDERSTATES the tail")
print(f"\n95% CVaR / expected shortfall: {cvar95:.2f}%   - the AVERAGE loss on the worst 5% of days")
print(f"Worst actual day             : {r.min():.2f}%   - far beyond any VaR (COVID, Mar 2020)")
print("\nVaR is the line; CVaR is how bad it gets beyond it. Fat tails make 'beyond' ugly.")
