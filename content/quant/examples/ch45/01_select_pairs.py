# Selecting a pair: correlation is cheap, cointegration is rare. Screen three candidate pairs.
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


def screen(sym_a, sym_b):
    df = pd.concat([close(sym_a), close(sym_b)], axis=1).dropna()
    df.columns = [sym_a, sym_b]
    a, b = df[sym_a], df[sym_b]
    corr = a.corr(b)                                    # do they move together day to day?
    pval = coint(a, b)[1]                               # Engle-Granger: is the spread stationary?
    hedge = sm.OLS(a, sm.add_constant(b)).fit().params.iloc[1]
    return {"pair": f"{sym_a}/{sym_b}", "corr": corr, "pval": pval, "hedge": hedge}


rows = [screen("HDFCBANK", "ICICIBANK"),     # the "obvious" private-bank pair
        screen("TCS", "INFY"),               # the "obvious" IT pair
        screen("KOTAKBANK", "HDFCBANK")]     # a less obvious bank pair
rows.sort(key=lambda r: r["pval"])

print("Engle-Granger pair screen (NSE daily, 2021-01-01 to today)")
print(f"{'pair':<22}{'corr':>7}{'coint p':>10}{'hedge':>8}  verdict")
for r in rows:
    verdict = "COINTEGRATED" if r["pval"] < 0.05 else "correlated, not cointegrated"
    print(f"{r['pair']:<22}{r['corr']:>7.2f}{r['pval']:>10.3f}{r['hedge']:>8.2f}  {verdict}")

best = rows[0]
print(f"\nTradeable pair: {best['pair']} (p = {best['pval']:.3f}, corr {best['corr']:.2f}). "
      f"The most correlated pairs are NOT the cointegrated ones.")
