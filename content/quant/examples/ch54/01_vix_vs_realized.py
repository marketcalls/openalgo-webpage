# India VIX is implied vol; NIFTY's own moves are realized vol. The gap is the premium.
import os

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# 1. India VIX = the market's 30-day implied (forward) volatility, in annualised %.
vix = client.quotes(symbol="INDIAVIX", exchange="NSE_INDEX")["data"]["ltp"]

# 2. NIFTY daily history -> realized (backward-looking) volatility from log returns.
nifty = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date="2025-04-01", end_date="2026-06-28")
spot = nifty["close"].iloc[-1]
ret = np.log(nifty["close"] / nifty["close"].shift(1)).dropna()
realized = ret.tail(21).std(ddof=1) * np.sqrt(252) * 100   # trailing ~1 month, annualised

# 3. VIX as an expected move: annual vol scaled to the horizon, then to NIFTY points.
move_1d = spot * (vix / 100) / np.sqrt(252)
move_30d = spot * (vix / 100) / np.sqrt(12)

# 4. The volatility risk premium = implied minus realized (today, and over the year).
vix_hist = client.history(symbol="INDIAVIX", exchange="NSE_INDEX", interval="D",
                          start_date="2025-04-01", end_date="2026-06-28")["close"]
rv_series = ret.rolling(21).std(ddof=1) * np.sqrt(252) * 100
vrp = (vix_hist - rv_series).dropna().loc["2025-06-25":]

print(f"India VIX (implied, 30-day annualised): {vix:.2f}%")
print(f"NIFTY realized vol (trailing 21 sessions):  {realized:.2f}%")
print(f"Volatility risk premium today: {vix - realized:+.2f} vol points\n")
print(f"VIX expects a 1-sigma NIFTY move of {move_1d:,.0f} pts/day, {move_30d:,.0f} pts over 30 days "
      f"(spot {spot:,.0f}).\n")
print(f"Over the last year: mean implied {vix_hist.loc[vrp.index].mean():.2f}%, "
      f"mean realized {rv_series.loc[vrp.index].mean():.2f}%, mean premium {vrp.mean():+.2f} pts; "
      f"implied beat realized on {(vrp > 0).mean() * 100:.0f}% of days.")
