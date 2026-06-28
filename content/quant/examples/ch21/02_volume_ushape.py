# The intraday volume U-shape: traded quantity by minute-of-day for a liquid stock.
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

SYMBOL = "RELIANCE"
df = client.history(symbol=SYMBOL, exchange="NSE", interval="1m",
                    start_date="2026-06-01", end_date="2026-06-28").sort_index()
ndays = df.index.normalize().nunique()

# Average traded volume at each minute-of-day across all sessions in the window.
df["mod"] = df.index.strftime("%H:%M")
prof = df.groupby("mod")["volume"].mean().reset_index()
prof["t"] = pd.to_datetime(prof["mod"], format="%H:%M")

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(9, 4.5))
ax.fill_between(prof["t"], prof["volume"], color="#7c83ff", alpha=0.25)
ax.plot(prof["t"], prof["volume"], color="#7c83ff", linewidth=1.6)
ax.set_title(f"{SYMBOL} (NSE) - average traded volume by minute-of-day ({ndays} sessions)")
ax.set_xlabel("Time of day")
ax.set_ylabel("Avg shares traded per minute")
import matplotlib.dates as mdates
ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")

g = prof.set_index("mod")["volume"]
print(f"{SYMBOL}: open minute 09:15 avg {g['09:15']:,.0f} sh  vs  midday 12:00 avg "
      f"{g['12:00']:,.0f} sh  vs  close 15:29 avg {g['15:29']:,.0f} sh. Saved {out.name}")
