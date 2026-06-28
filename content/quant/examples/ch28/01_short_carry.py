# Cost of carry of a short held via the near-month future: basis -> implied annualised carry.
import math
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SPOT, FUT, EXPIRY = "RELIANCE", "RELIANCE28JUL26FUT", datetime(2026, 7, 28)
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=45)).strftime("%Y-%m-%d")

s = client.history(symbol=SPOT, exchange="NSE", interval="D", start_date=start, end_date=end)
f = client.history(symbol=FUT, exchange="NFO", interval="D", start_date=start, end_date=end)
j = pd.DataFrame({"spot": s["close"], "fut": f["close"]}).dropna()

asof = j.index[-1]
S, F = j["spot"].iloc[-1], j["fut"].iloc[-1]
days = (EXPIRY - asof).days
T = days / 365.0

basis = F - S
basis_pct = (F / S - 1) * 100
carry_ann = math.log(F / S) / T * 100  # continuous, annualised
avg_basis = (j["fut"] - j["spot"]).mean()

print(f"As of {asof.date()}   spot {S:,.1f}   {FUT} {F:,.1f}")
print(f"Basis (future - spot): {basis:+.2f} pts  ({basis_pct:+.2f}%),  {days} days to expiry")
print(f"Avg basis over window: {avg_basis:+.2f} pts")
print(f"Implied annualised carry: {carry_ann:+.2f}%")
sign = "positive carry - it earns" if basis > 0 else "negative carry - it pays"
print(f"A short via the future sells the {basis_pct:+.2f}% premium, so the short has {sign} ~{abs(carry_ann):.2f}% annualised as the future converges to spot.")
