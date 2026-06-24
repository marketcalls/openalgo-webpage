# Reach into an array by position -- the same indexing you used for lists.
import numpy as np

# Ten days of NIFTY closing values.
nifty = np.array([25900, 25960, 25840, 25990, 26050,
                  26010, 25880, 25930, 26100, 26075])

print("First day   :", nifty[0])
print("Latest day  :", nifty[-1])     # -1 is "most recent" -- used constantly
print("Days 2 to 4 :", nifty[1:4])    # positions 1,2,3 (the stop is excluded)
print("Last 5 days :", nifty[-5:])
print("Every 2nd   :", nifty[::2])    # a step of 2
