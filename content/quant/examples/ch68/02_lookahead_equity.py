# The leaked equity curve is implausibly smooth; the honest one just wanders.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
c = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2018-01-01", end_date=end)["close"]
r = c.pct_change()
signal = np.sign(c - c.shift(10))     # 10-day momentum

leaked = (1 + (signal * r).fillna(0)).cumprod()
honest = (1 + (signal.shift(1) * r).fillna(0)).cumprod()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(leaked.index, leaked, color="#dc2626", lw=1.8, label="leaked (scored on the same bar)")
ax.plot(honest.index, honest, color="#16a34a", lw=1.8, label="honest (prior bars only)")
ax.set_yscale("log")
ax.set_title("A signal scored on its own bar prints a fake, too-smooth equity curve")
ax.set_ylabel("Growth of 1, log scale (NIFTY 10-day momentum)")
ax.legend(loc="upper left")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Leaked grows to {leaked.iloc[-1]:.1f}x; honest ends at {honest.iloc[-1]:.2f}x. Saved {out.name}")
