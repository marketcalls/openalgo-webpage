# The look-ahead equity curve rockets; the honest one crawls. Same code, one-bar bug.
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
                   start_date="2021-01-01", end_date=end)["close"]
r = c.pct_change()
signal = np.sign(c - c.rolling(20).mean())

cheat = (1 + (signal * r).fillna(0)).cumprod()
honest = (1 + (signal.shift(1) * r).fillna(0)).cumprod()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(cheat.index, cheat, color="#dc2626", lw=1.8, label="with look-ahead (a lie)")
ax.plot(honest.index, honest, color="#16a34a", lw=1.8, label="correctly lagged (the truth)")
ax.set_title("Same strategy, one-bar bug - the look-ahead curve is fiction")
ax.set_ylabel("Growth of 1")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Look-ahead final {cheat.iloc[-1]:.1f}x vs honest {honest.iloc[-1]:.2f}x. Saved {out.name}")
