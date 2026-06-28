# USD-INR currency future: level, daily range and how its vol compares to equity.
import os

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Find the live USD-INR futures on the currency segment (CDS) and keep the
# contract with the deepest daily history (the liquid monthly future).
hits = client.search(query="USDINR", exchange="CDS")["data"]
futs = [h["symbol"] for h in hits if h["instrumenttype"] == "FUT"]

best, usd = None, None
for sym in futs:
    df = client.history(symbol=sym, exchange="CDS", interval="D",
                        start_date="2025-06-28", end_date="2026-06-28")
    if hasattr(df, "shape") and (usd is None or len(df) > len(usd)):
        best, usd = sym, df

nif = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                     start_date="2025-06-28", end_date="2026-06-28")


def ann_vol(df):
    r = np.log(df["close"] / df["close"].shift(1)).dropna()
    return r.std() * np.sqrt(252) * 100


usd_last = usd["close"].iloc[-1]
usd_range = usd["high"].iloc[-1] - usd["low"].iloc[-1]
usd_vol, nif_vol = ann_vol(usd), ann_vol(nif)

print(f"Contract             : {best} (CDS)")
print(f"USD-INR last close   : {usd_last:.4f}")
print(f"Last day's range     : {usd_range:.4f}  ({usd_range / usd_last * 100:.2f}% of level)")
print(f"Annualised vol       : {usd_vol:.2f}%   ({len(usd)} daily bars)")
print(f"NIFTY annualised vol : {nif_vol:.2f}%")
print(f"Equity vol / FX vol  : {nif_vol / usd_vol:.1f}x")
print()
print("The rupee is a managed, low-vol macro variable: USD-INR realises a fraction")
print("of equity-index volatility, which is why it is hedged rather than chased.")
