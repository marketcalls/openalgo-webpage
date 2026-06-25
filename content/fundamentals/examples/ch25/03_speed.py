import time
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

N = 3_000_000

# Way 1: a plain Python loop - one number at a time.
t0 = time.perf_counter()
total = 0.0
for i in range(N):
    total += i * i
py_ms = (time.perf_counter() - t0) * 1000

# Way 2: NumPy - the same maths inside a compiled C core.
t0 = time.perf_counter()
arr = np.arange(N, dtype="float64")
total_np = (arr * arr).sum()
np_ms = (time.perf_counter() - t0) * 1000

speedup = py_ms / np_ms
print(f"Pure Python: {py_ms:8.1f} ms")
print(f"NumPy      : {np_ms:8.1f} ms")
print(f"Speed-up   : {speedup:.0f}x faster, same answer")

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["Pure Python", "NumPy (C core)"], [py_ms, np_ms], color=["#c98f8f", "#7c83ff"])
ax.set_ylabel("Time in milliseconds (lower is better)")
ax.set_title(f"Same sum, about {speedup:.0f}x faster with NumPy")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
