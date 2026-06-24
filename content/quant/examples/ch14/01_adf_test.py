# Are prices predictable? The ADF test asks: is this just a random walk?
import os
from datetime import datetime

from openalgo import api
from statsmodels.tsa.stattools import adfuller

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
p = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2021-01-01", end_date=end)["close"]
r = p.pct_change().dropna()

# ADF null hypothesis: the series is NON-stationary (a random walk with a unit root).
# A small p-value (< 0.05) lets us reject that and call it stationary.
adf_price = adfuller(p)
adf_ret = adfuller(r)


def verdict(pval):
    return "STATIONARY (mean-reverting)" if pval < 0.05 else "NON-stationary (random walk)"


print("ADF test  (null = random walk):")
print(f"  NIFTY price   : stat {adf_price[0]:6.2f}   p-value {adf_price[1]:.3f}   -> {verdict(adf_price[1])}")
print(f"  NIFTY returns : stat {adf_ret[0]:6.2f}   p-value {adf_ret[1]:.3f}   -> {verdict(adf_ret[1])}")
print("\nPrice wanders with no anchor; returns are stationary - which is why quants model RETURNS, not price.")
