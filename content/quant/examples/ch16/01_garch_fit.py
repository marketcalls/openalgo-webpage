# Volatility clusters and persists - GARCH(1,1) captures it. Fit one to Nifty.
import os
from datetime import datetime

from arch import arch_model
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2021-01-01", end_date=end)["close"].pct_change().dropna() * 100

res = arch_model(r, vol="Garch", p=1, q=1, mean="Constant").fit(disp="off")
alpha, beta = res.params["alpha[1]"], res.params["beta[1]"]

print("GARCH(1,1) fitted to Nifty daily returns:")
print(f"  alpha (reaction to yesterday's shock) : {alpha:.3f}")
print(f"  beta  (persistence of past variance)  : {beta:.3f}")
print(f"  alpha + beta (total persistence)      : {alpha + beta:.3f}   (near 1 = vol clusters strongly)")

next_vol = float(res.forecast(horizon=1).variance.iloc[-1, 0]) ** 0.5
print(f"\nForecast next-day volatility : {next_vol:.2f}%  (annualised ~{next_vol * 252 ** 0.5:.1f}%)")
print("Unlike returns, volatility HAS memory - so it can genuinely be forecast.")
