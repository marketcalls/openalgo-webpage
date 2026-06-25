import numpy as np

# Handy ways to build arrays without typing every value.
print("arange(0,10,2) :", np.arange(0, 10, 2))      # start, stop, step
print("zeros(4)       :", np.zeros(4))               # all zeros
print("ones(3)        :", np.ones(3))                # all ones
print("full(3, 100)   :", np.full(3, 100))           # filled with one value
print("linspace(0,1,5):", np.linspace(0, 1, 5))      # 5 evenly spaced points

# Reproducible random numbers - e.g. simulated daily returns (seeded, so stable).
rng = np.random.default_rng(42)
print("random normals :", rng.normal(0, 1, 5).round(2))

# Reshape a flat array into rows and columns (a 2x3 grid).
grid = np.arange(6).reshape(2, 3)
print("reshaped 2x3   :\n", grid)
