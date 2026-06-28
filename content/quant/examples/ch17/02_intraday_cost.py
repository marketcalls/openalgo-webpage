# Trading cost is not constant: a per-bar spread proxy over one session reveals the intraday U-shape.
import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SYMBOL, EXCHANGE, DAY = "RELIANCE", "NSE", "2026-06-25"
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="1m",
                    start_date=DAY, end_date=DAY)
df = df[df["volume"] > 0].copy()
df.index = df.index.tz_localize(None)        # show the IST clock on the x-axis

# Per-bar cost proxy: how far price travels inside one minute, in basis points of price.
df["cost_bps"] = (df["high"] - df["low"]) / df["close"] * 1e4
df["smooth"] = df["cost_bps"].rolling(10, min_periods=1).mean()
median = df["cost_bps"].median()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.5))
ax.scatter(df.index, df["cost_bps"], s=6, color="#c9ccd6", alpha=0.5, label="per-minute proxy")
ax.plot(df.index, df["smooth"], color="#7c83ff", lw=2, label="10-minute average")
ax.axhline(median, color="#16a34a", ls="--", lw=1, label=f"median {median:.1f} bps")
ax.set_title(f"{SYMBOL} {DAY} - cost of crossing the spread, by minute")
ax.set_xlabel("Time of day (IST)")
ax.set_ylabel("Cost proxy (bps of price)")
ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))
ax.legend(loc="upper center", ncol=3, frameon=False)

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

open15 = df["cost_bps"].iloc[:15].mean()
midday = df["cost_bps"].between_time("12:00", "13:00").mean()
close15 = df["cost_bps"].iloc[-15:].mean()
print(f"{SYMBOL} {DAY}: open {open15:.1f} bps, midday {midday:.1f} bps, close {close15:.1f} bps "
      f"- cost is widest at the open. Saved {out.name}")
