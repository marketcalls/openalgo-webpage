# Volatility: how jumpy returns are, measured with standard deviation (std), then annualised.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

prices = df["close"].to_numpy()
returns = np.log(prices[1:] / prices[:-1])     # log returns are the standard input here

daily_vol = returns.std()                       # std = typical spread of returns around the mean
annual_vol = daily_vol * np.sqrt(252)           # scale to a year (~252 trading days)

print("Daily volatility  (%):", round(daily_vol * 100, 2))
print("Annual volatility (%):", round(annual_vol * 100, 2))
print("Mean daily return (%):", round(returns.mean() * 100, 3))
