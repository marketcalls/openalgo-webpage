# Watch the Monte Carlo estimate home in on the true answer as samples pile up.
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

rng = np.random.default_rng(0)
N = 50_000
cuts = np.sort(rng.random((N, 2)), axis=1)
a, b, c = cuts[:, 0], cuts[:, 1] - cuts[:, 0], 1 - cuts[:, 1]
hits = ((a < 0.5) & (b < 0.5) & (c < 0.5)).astype(float)

running = np.cumsum(hits) / np.arange(1, N + 1)        # running probability estimate

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(np.arange(1, N + 1), running, color="#7c83ff", lw=1)
ax.axhline(0.25, color="#16a34a", ls="--", lw=1.6, label="true answer = 1/4")
ax.set_xscale("log")
ax.set_ylim(0.1, 0.4)
ax.set_title("Monte Carlo convergence - the estimate settles onto 1/4")
ax.set_xlabel("Number of simulations (log scale)")
ax.set_ylabel("Estimated probability")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"After {N:,} sims the estimate is {running[-1]:.4f} (true 0.2500). Saved {out.name}")
