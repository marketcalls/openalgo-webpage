# Signal half-life: how fast a mean-reverting spread's edge decays, from autocorrelation.
import os
from datetime import datetime

import numpy as np
import pandas as pd
import statsmodels.api as sm
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")


def close(symbol):
    return client.history(symbol=symbol, exchange="NSE", interval="D",
                          start_date="2021-01-01", end_date=end)["close"]


# Two large private banks - a mean-reverting spread to measure the half-life of.
df = pd.concat([close("HDFCBANK"), close("KOTAKBANK")], axis=1).dropna()
df.columns = ["HDFCBANK", "KOTAKBANK"]
hedge = sm.OLS(df["HDFCBANK"], sm.add_constant(df["KOTAKBANK"])).fit().params.iloc[1]
spread = df["HDFCBANK"] - hedge * df["KOTAKBANK"]

# Autocorrelation decays geometrically for a mean-reverting series: rho(k) ~ phi**k.
lags = [1, 5, 10, 20, 40]
acf = {k: spread.autocorr(k) for k in lags}

# Ornstein-Uhlenbeck fit: regress the daily CHANGE on the lagged LEVEL.
ds = spread.diff().dropna()
lvl = spread.shift(1).loc[ds.index]
beta = sm.OLS(ds, sm.add_constant(lvl)).fit().params.iloc[1]   # mean-reversion speed (<0)
half_life = -np.log(2) / beta                                  # days to close half the gap

print("Signal half-life from spread autocorrelation decay: HDFCBANK vs KOTAKBANK")
print(f"  hedge ratio (OLS)      : {hedge:.2f}")
print("  autocorrelation decay  : " + "  ".join(f"lag{k}={acf[k]:.3f}" for k in lags))
print(f"  OU mean-reversion beta : {beta:+.4f} per day")
print(f"  HALF-LIFE              : {half_life:.1f} trading days  (~{half_life / 5:.0f} weeks)")
print(f"\nThe edge halves in {half_life:.0f} days, so the signal tolerates only "
      f"~{252 / half_life:.0f} round trips a year before it is just churning costs.")
