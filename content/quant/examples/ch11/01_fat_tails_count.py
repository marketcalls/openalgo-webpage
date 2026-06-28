# How often NIFTY breaches 4 sigma - the normal's prediction versus reality.
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
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2015-01-01", end_date=end)
r = np.log(df["close"] / df["close"].shift(1)).dropna()
n = len(r)
sigma = r.std()

# Shape of the distribution
skew = stats.skew(r)
ex_kurt = stats.kurtosis(r)  # excess kurtosis (normal = 0)

# Days beyond 4 standard deviations, observed vs what a normal predicts
z = (r - r.mean()) / sigma
beyond4 = int((z.abs() > 4).sum())
p_normal = 2 * stats.norm.sf(4)          # P(|Z| > 4) under a normal
expected4 = n * p_normal

worst = r.min()
print(f"NIFTY daily log returns since 2015: {n} days, sigma {sigma*100:.2f}%")
print(f"Skew {skew:.2f}, excess kurtosis {ex_kurt:.2f} (normal = 0)")
print(f"Beyond-4-sigma days: observed {beyond4}, a normal predicts {expected4:.2f}")
print(f"Reality delivers {beyond4/expected4:.0f}x the normal count. "
      f"Worst single day: {worst*100:.1f}%")
