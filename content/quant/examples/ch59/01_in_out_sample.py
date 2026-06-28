# In-sample vs out-of-sample: the test that separates a real edge from an overfit one.
import os
from datetime import datetime

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
c = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2019-01-01", end_date=end)["close"]
r = c.pct_change()
split = len(c) // 2


def sharpe(x):
    return x.mean() / x.std() * np.sqrt(252) if x.std() else 0


# Search MANY moving-average lengths on the IN-SAMPLE half, keep the best.
best_n, best_s = None, -99
for n in range(10, 121, 5):
    sig = (c > c.rolling(n).mean()).astype(int).shift(1)
    s = sharpe((sig * r).iloc[:split].dropna())
    if s > best_s:
        best_n, best_s = n, s

# Now test THAT winner, untouched, on the OUT-OF-SAMPLE half.
sig = (c > c.rolling(best_n).mean()).astype(int).shift(1)
oos = sharpe((sig * r).iloc[split:].dropna())

print(f"Best in-sample SMA length : {best_n} days  ->  Sharpe {best_s:.2f}  (looks great!)")
print(f"Same rule, out-of-sample  : Sharpe {oos:.2f}  (the honest verdict)")
print("\nThe edge that shone in-sample mostly evaporates out-of-sample - the signature of overfitting.")
