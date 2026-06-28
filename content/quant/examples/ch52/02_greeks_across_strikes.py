# Delta and gamma across the Nifty call chain - delta sweeps 0 to 1, gamma peaks at the money.
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

# Walk the 28-Jul-2026 chain strike by strike via optiongreeks (Black-76 off the forward).
def fetch(strike):
    for _ in range(4):  # the Greeks endpoint rate-limits rapid calls; pace and retry
        r = client.optiongreeks(symbol=f"NIFTY28JUL26{strike}CE", exchange="NFO", interest_rate=0.0,
                                underlying_symbol="NIFTY", underlying_exchange="NSE_INDEX")
        if (r.get("greeks") or {}).get("delta") is not None:
            return r
        time.sleep(1.0)
    return r


rows, forward = [], None
for strike in range(22800, 25801, 200):
    r = fetch(strike)
    g = r.get("greeks") or {}
    if g.get("delta") is not None:
        forward = r["spot_price"]
        rows.append({"strike": strike, "delta": g["delta"], "gamma": g["gamma"]})
    time.sleep(0.8)

df = pd.DataFrame(rows)

sns.set_theme(style="whitegrid")
fig, ax1 = plt.subplots(figsize=(8, 4.5))
ax1.plot(df["strike"], df["delta"], color="#7c83ff", lw=2, marker="o", ms=4, label="Delta (call)")
ax1.axvline(forward, color="#dc2626", ls="--", lw=1.2, label=f"forward {forward:.0f}")
ax1.set_xlabel("Strike")
ax1.set_ylabel("Delta", color="#7c83ff")
ax1.set_ylim(0, 1)

ax2 = ax1.twinx()
ax2.plot(df["strike"], df["gamma"], color="#16a34a", lw=1.8, marker="s", ms=3, label="Gamma")
ax2.set_ylabel("Gamma", color="#16a34a")
ax2.grid(False)

ax1.set_title("Nifty 28-Jul-2026 call Greeks across strikes - delta S-curve, gamma peaks ATM")
ax1.legend(loc="center left")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

peak = df.loc[df["gamma"].idxmax(), "strike"]
print(f"Delta {df['delta'].max():.2f} (ITM) -> {df['delta'].min():.2f} (OTM); "
      f"gamma peaks at strike {peak:.0f} near forward {forward:.0f}. Saved {out.name}")
