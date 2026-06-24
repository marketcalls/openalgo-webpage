# Fit an ARIMA model to Nifty returns and forecast - and see how little it can say.
import os
import warnings
from datetime import datetime

from openalgo import api
from statsmodels.tsa.arima.model import ARIMA

warnings.filterwarnings("ignore")

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2021-01-01", end_date=end)["close"].pct_change().dropna() * 100

# ARIMA(1,0,1): today's return from 1 past return (AR) + 1 past shock (MA).
model = ARIMA(r.values, order=(1, 0, 1)).fit()
ar = model.arparams[0] if len(model.arparams) else 0.0
ma = model.maparams[0] if len(model.maparams) else 0.0

print("ARIMA(1,0,1) fitted to Nifty daily returns:")
print(f"  AR coefficient (weight on yesterday's return): {ar:+.3f}")
print(f"  MA coefficient (weight on yesterday's shock)  : {ma:+.3f}")
print(f"\n5-day forecast (%): {[round(float(x), 3) for x in model.forecast(5)]}")
print(f"Mean daily return  : {r.mean():.3f}%")
print("\nThe coefficients are tiny and the forecast collapses to the mean - returns barely autocorrelate.")
