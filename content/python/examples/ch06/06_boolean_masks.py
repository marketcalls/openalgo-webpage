# Ask a yes/no question of every element, then filter or count.
import numpy as np

closes = np.array([1305.0, 1298.5, 1310.4, 1318.6, 1312.7])
avg = closes.mean()

mask = closes > avg                        # True/False for each day
print("Above average?:", mask)
print("Those closes  :", closes[mask])     # keep only the True ones
print("How many days :", mask.sum())       # True counts as 1

# np.where labels every element in one stroke (1 = above avg, 0 = not).
tags = np.where(closes > avg, 1, 0)
print("Tags          :", tags)
