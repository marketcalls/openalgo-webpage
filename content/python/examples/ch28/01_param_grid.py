# An optimisation starts with a parameter GRID -- every combo we want to test.
import itertools

# A grid is just the set of settings you want to try.
fast_lengths = [10, 20, 30, 40]      # fast EMA candidates
slow_lengths = [20, 30, 40, 50]      # slow EMA candidates

# A "combo" is one (fast, slow) pair. We only keep pairs where fast < slow,
# because a crossover system needs the fast line to be the quicker one. The
# ranges overlap, so several raw pairs (e.g. 40/20) are nonsense and get cut.
combos = [(f, s) for f, s in itertools.product(fast_lengths, slow_lengths) if f < s]

print(f"Fast options : {fast_lengths}")
print(f"Slow options : {slow_lengths}")
print(f"Raw combos   : {len(fast_lengths) * len(slow_lengths)}")
print(f"Valid combos : {len(combos)}  (kept only fast < slow)")
print("\nFirst few combos to test:")
for f, s in combos[:5]:
    print(f"  EMA {f} crossing EMA {s}")

# Keep grids small. Each extra value multiplies the work -- and the temptation
# to cherry-pick a winner that only looks good by luck.
