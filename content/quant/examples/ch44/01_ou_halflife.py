# Fit an Ornstein-Uhlenbeck / AR(1) model to one mean-reverting series and find its half-life.
import os
from datetime import datetime

import numpy as np
import statsmodels.api as sm
from openalgo import api
from statsmodels.tsa.stattools import adfuller

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
px = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                    start_date="2021-01-01", end_date=end)["close"]

# One series that should mean-revert: the log-distance of price from its own 20-day average.
sma20 = px.rolling(20).mean()
x = np.log(px / sma20).dropna()                 # log-deviation, oscillates around ~0

# Does it TRULY revert? Augmented Dickey-Fuller: reject the unit root -> stationary -> reverts.
adf_p = adfuller(x, autolag="AIC")[1]

# OU discretised: dx = -kappa (x - theta) dt + noise. Regress the daily CHANGE on the LEVEL.
dx = x.diff().dropna()
lag = x.shift(1).loc[dx.index]
beta = sm.OLS(dx, sm.add_constant(lag)).fit().params
kappa = -beta.iloc[1]                            # speed of mean reversion, per day
theta = beta.iloc[0] / kappa                     # long-run mean it is pulled toward
halflife = np.log(2) / kappa                     # days to close half the gap

print("Ornstein-Uhlenbeck fit: RELIANCE log-deviation from its own 20-day average")
print(f"  ADF p-value     : {adf_p:.4f}  -> {'stationary, it truly reverts' if adf_p < 0.05 else 'cannot reject a random walk'}")
print(f"  reversion speed : kappa = {kappa:.3f} per day")
print(f"  long-run mean   : theta = {theta:+.4f}  (log-deviation, ~0 = price sits on its average)")
print(f"  half-life       : {halflife:.1f} days  (time to close half the gap back to the mean)")
print(f"SUMMARY: deviation reverts with kappa={kappa:.3f}/day, half-life {halflife:.1f} days, ADF p={adf_p:.3f}.")
