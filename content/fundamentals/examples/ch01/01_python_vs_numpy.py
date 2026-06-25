# Is Python slow? Let's settle it with a stopwatch.
# We add up the squares of 5 million numbers two ways and time each.
import time

import numpy as np

N = 5_000_000

# Way 1: pure Python - a plain loop, one number at a time (interpreted).
start = time.perf_counter()
total = 0.0
for i in range(N):
    total += i * i
pure_python = time.perf_counter() - start

# Way 2: NumPy - the SAME maths, but run inside a compiled C core.
start = time.perf_counter()
numbers = np.arange(N, dtype="float64")
total_numpy = (numbers * numbers).sum()
numpy_time = time.perf_counter() - start

print(f"Pure Python loop : {pure_python * 1000:8.1f} ms")
print(f"NumPy (C core)   : {numpy_time * 1000:8.1f} ms")
print(f"Same answer?       {np.isclose(total, total_numpy)}")
print(f"NumPy is about {pure_python / numpy_time:.0f}x faster - you wrote less and waited less.")
