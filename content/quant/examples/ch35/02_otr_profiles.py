# Running order-to-trade ratio: an honest maker vs a quote-stuffing profile.
import os
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

df = client.history(symbol="RELIANCE", exchange="NSE", interval="1m",
                    start_date="2026-06-23", end_date="2026-06-27")
close = df["close"].dropna()
move = close.diff().fillna(0.0)

# Honest maker: two order messages per real mid move, fills at turning points.
honest_orders = 2 * (move != 0).to_numpy().astype(float)
sign = np.sign(move.to_numpy())
turn = np.zeros(len(close))
nz_idx = np.flatnonzero(sign != 0)
flip = nz_idx[1:][np.diff(sign[nz_idx]) != 0]
turn[flip] = 1.0
rng = np.random.default_rng(7)
fills = turn * (rng.random(len(close)) < 0.6)

# Stuffing profile: same fills, plus a flood of phantom quotes cancelled in microseconds.
phantom = rng.poisson(20, len(close)).astype(float)
stuff_orders = honest_orders + phantom

cum_fills = np.maximum(np.cumsum(fills), 1)
otr_honest = np.cumsum(honest_orders) / cum_fills
otr_stuff = np.cumsum(stuff_orders) / cum_fills

THRESHOLD = 50.0
warm = int(np.argmax(np.cumsum(fills) >= 5))   # skip the noisy small-denominator warm-up
x = np.arange(len(close))[warm:]
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8.4, 4.6))
ax.axhspan(THRESHOLD, otr_stuff[warm:].max() * 1.10,
           color="#dc2626", alpha=0.10)
ax.axhline(THRESHOLD, color="#dc2626", lw=1.4, ls="--",
           label=f"illustrative penalty band ~{THRESHOLD:.0f}:1")
ax.plot(x, otr_honest[warm:], color="#16a34a", lw=1.8, label="honest maker")
ax.plot(x, otr_stuff[warm:], color="#7c83ff", lw=1.8, label="quote-stuffing profile")
ax.set_title("Running order-to-trade ratio: honest making vs quote stuffing")
ax.set_xlabel("Minute bar of the session window")
ax.set_ylabel("Cumulative order-to-trade ratio")
ax.legend(loc="center right")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Honest OTR settles at {otr_honest[-1]:.1f}:1; stuffing profile ends at "
      f"{otr_stuff[-1]:.1f}:1, deep in the penalty zone. Saved {out.name}")
