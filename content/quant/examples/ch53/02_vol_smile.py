# Plot the volatility skew - implied vol against strike - with India VIX for scale.
import os
import time
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

vix = client.quotes(symbol="INDIAVIX", exchange="NSE_INDEX")["data"]["ltp"]
rows = []
for strike in range(23400, 24701, 100):
    r = client.optiongreeks(symbol=f"NIFTY30JUN26{strike}CE", exchange="NFO", interest_rate=0.0,
                            underlying_symbol="NIFTY", underlying_exchange="NSE_INDEX")
    if r.get("implied_volatility"):
        rows.append({"strike": strike, "iv": r["implied_volatility"]})
    time.sleep(0.3)

df = pd.DataFrame(rows)
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(df["strike"], df["iv"], color="#7c83ff", lw=2, marker="o", ms=4, label="implied vol")
ax.axvline(24058, color="#888", ls="--", lw=1.2, label="forward ~24058")
ax.axhline(vix, color="#16a34a", ls=":", lw=1.6, label=f"India VIX {vix}%")
ax.set_title("NIFTY implied-volatility skew (lower strikes = pricier insurance)")
ax.set_xlabel("Strike")
ax.set_ylabel("Implied volatility (%)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"IV runs {df['iv'].max():.1f}% (low strikes) -> {df['iv'].min():.1f}% (high strikes). India VIX {vix}%. Saved {out.name}")
