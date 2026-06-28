# A classic quant-interview puzzle, cracked the quant way - by simulation.
# Break a stick at two random points. What's the chance the 3 pieces form a triangle?
import numpy as np

rng = np.random.default_rng(0)
N = 500_000

cuts = np.sort(rng.random((N, 2)), axis=1)          # two random break points in [0,1]
a = cuts[:, 0]
b = cuts[:, 1] - cuts[:, 0]
c = 1 - cuts[:, 1]

# Three lengths form a triangle only if NO piece is longer than half the stick.
forms_triangle = (a < 0.5) & (b < 0.5) & (c < 0.5)
prob = forms_triangle.mean()

print(f"Simulated {N:,} broken sticks.")
print(f"P(three pieces form a triangle) ~ {prob:.4f}")
print(f"Exact answer                     = {1 / 4:.4f}  (1/4)")
print("\nWhen the maths is hard, a quant simulates - the same Monte Carlo tool from Chapter 12.")
