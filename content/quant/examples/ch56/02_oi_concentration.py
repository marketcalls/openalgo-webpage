# Bar-chart Nifty open interest across strikes - liquidity clusters at round strikes.
import os
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

# Wide window around the money so the round-strike clustering is visible.
r = client.optionchain(underlying="NIFTY", exchange="NSE_INDEX",
                       expiry_date="28JUL26", strike_count=22)
atm = r["atm_strike"]
rows = [{"strike": row["strike"],
         "oi": (row["ce"] or {}).get("oi", 0) + (row["pe"] or {}).get("oi", 0)}
        for row in r["chain"]]
df = pd.DataFrame(rows).sort_values("strike")
# Colour the 500-multiple "round" strikes apart from the rest.
df["round"] = df["strike"] % 500 == 0
colors = ["#7c83ff" if rnd else "#cbd5e1" for rnd in df["round"]]

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.5))
ax.bar(df["strike"], df["oi"] / 1e6, width=38, color=colors)
ax.axvline(atm, color="#dc2626", ls="--", lw=1.2, label=f"ATM {atm:.0f}")
ax.set_title("NIFTY 28-Jul-2026 open interest by strike (CE+PE) - clustered at round strikes")
ax.set_xlabel("Strike")
ax.set_ylabel("Total open interest (millions)")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

peak = df.loc[df["oi"].idxmax()]
round_share = df.loc[df["round"], "oi"].sum() / df["oi"].sum() * 100
print(f"Peak OI at strike {peak['strike']:.0f} = {peak['oi'] / 1e6:.2f}M contracts; "
      f"the 500-multiple round strikes hold {round_share:.0f}% of all OI in the window. Saved {out.name}")
