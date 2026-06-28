# Backtest a market-neutral pairs trade on the cointegrated Reliance-ONGC spread.
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


def close(sym):
    return client.history(symbol=sym, exchange="NSE", interval="D",
                          start_date="2021-01-01", end_date=end)["close"]


df = pd.concat([close("RELIANCE"), close("ONGC")], axis=1).dropna()
df.columns = ["a", "b"]
hedge = sm.OLS(df["a"], sm.add_constant(df["b"])).fit().params.iloc[1]
spread = df["a"] - hedge * df["b"]
z = (spread - spread.rolling(60).mean()) / spread.rolling(60).std()    # rolling, no look-ahead

# Stateful rule: short spread above +2, long below -2, flat inside +/-0.5.
pos, p = [], 0
for zi in z:
    if not np.isnan(zi):
        if p == 0 and zi > 2:
            p = -1
        elif p == 0 and zi < -2:
            p = 1
        elif p != 0 and abs(zi) < 0.5:
            p = 0
    pos.append(p)
pos = pd.Series(pos, index=z.index)

pnl = (pos.shift(1) * spread.diff()).dropna()
sharpe = pnl.mean() / pnl.std() * np.sqrt(252)
corr = pnl.reindex(df.index).fillna(0).corr(df["a"].pct_change().fillna(0))

print(f"Trades taken        : {(pos.diff().abs() > 0).sum()}")
print(f"Total spread P&L     : {pnl.sum():.0f} points")
print(f"Strategy Sharpe      : {sharpe:.2f}")
print(f"Correlation to market: {corr:+.2f}   (near zero = market-neutral)")
print("\nProfit comes from the spread reverting - not from the market going up or down.")
