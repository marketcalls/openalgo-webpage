# Combine two symbols' closes into one aligned DataFrame, then compare them.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")


def close_of(sym):
    d = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    return d["close"]


# pd.concat lines the two Series up on their shared timestamp index.
prices = pd.concat({"TCS": close_of("TCS"), "INFY": close_of("INFY")}, axis=1).dropna()
print(prices.tail(3))

# Correlation of daily returns -- do these two IT names move together?
rets = prices.pct_change().dropna()
print("\nReturn correlation:", round(rets["TCS"].corr(rets["INFY"]), 3))
