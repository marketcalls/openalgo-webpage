# The delta curve: how an option's delta sweeps from 0 to 1 across strikes.
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

rows = []
for strike in range(23400, 24701, 100):
    r = client.optiongreeks(symbol=f"NIFTY30JUN26{strike}CE", exchange="NFO", interest_rate=0.0,
                            underlying_symbol="NIFTY", underlying_exchange="NSE_INDEX")
    g = r.get("greeks") or {}
    if g.get("delta") is not None:
        rows.append({"strike": strike, "delta": g["delta"], "gamma": g["gamma"]})
    time.sleep(0.3)

df = pd.DataFrame(rows)
forward = 24058

sns.set_theme(style="whitegrid")
fig, ax1 = plt.subplots(figsize=(8, 4.5))
ax1.plot(df["strike"], df["delta"], color="#7c83ff", lw=2, marker="o", ms=4, label="Delta (call)")
ax1.axvline(forward, color="#888", ls="--", lw=1.2, label="forward ~24058")
ax1.set_xlabel("Strike")
ax1.set_ylabel("Delta", color="#7c83ff")

ax2 = ax1.twinx()
ax2.plot(df["strike"], df["gamma"], color="#16a34a", lw=1.6, label="Gamma")
ax2.set_ylabel("Gamma", color="#16a34a")
ax2.grid(False)

ax1.set_title("Nifty call Greeks across strikes - delta S-curve, gamma peaks at the money")
ax1.legend(loc="center left")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Delta runs {df['delta'].max():.2f} (deep ITM) -> {df['delta'].min():.2f} (far OTM). Saved {out.name}")
