# Cointegration: two prices wander, but their SPREAD snaps back. Test and measure it.
import os
from datetime import datetime

import pandas as pd
import statsmodels.api as sm
from openalgo import api
from statsmodels.tsa.stattools import coint

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")


def close(symbol):
    return client.history(symbol=symbol, exchange="NSE", interval="D",
                          start_date="2021-01-01", end_date=end)["close"]


df = pd.concat([close("RELIANCE"), close("ONGC")], axis=1).dropna()
df.columns = ["RELIANCE", "ONGC"]
a, b = df["RELIANCE"], df["ONGC"]

pval = coint(a, b)[1]                                   # Engle-Granger test
hedge = sm.OLS(a, sm.add_constant(b)).fit().params.iloc[1]
spread = a - hedge * b
z_now = (spread.iloc[-1] - spread.mean()) / spread.std()

print("Engle-Granger cointegration: RELIANCE vs ONGC")
print(f"  p-value          : {pval:.3f}  -> {'COINTEGRATED (spread mean-reverts)' if pval < 0.05 else 'not cointegrated'}")
print(f"  hedge ratio      : {hedge:.2f}   (1 RELIANCE hedged with {hedge:.2f} ONGC)")
print(f"  spread z-score   : {z_now:+.2f}   ({'stretched - reversion likely' if abs(z_now) > 1.5 else 'near fair value'})")
print("\nCorrelation says they move together; cointegration says their SPREAD reliably comes back.")
