
# Verdicts move with the window. Split each pair's overlap in half and re-test.
def split_pvals(a, b):
    sub = pd.concat([lp[a], lp[b]], axis=1).dropna(); sub.columns = ["a", "b"]
    mid = sub.index[len(sub) // 2]
    full   = coint(sub["a"], sub["b"])[1]
    first  = coint(sub.loc[:mid, "a"],  sub.loc[:mid, "b"])[1]
    second = coint(sub.loc[mid:, "a"],  sub.loc[mid:, "b"])[1]
    return first, second, full

wp = SAME_SECTOR_PAIRS + [("HINDALCO","TATASTEEL"), ("INFY","HCLTECH")]
W = pd.DataFrame({f"{a}/{b}": split_pvals(a, b) for a, b in wp},
                 index=["first half", "second half", "full window"]).T

fig, ax = plt.subplots(figsize=(8.6, 5.2))
sns.heatmap(W, annot=True, fmt=".3f", cmap="rocket_r", vmin=0, vmax=1,
            linewidths=.6, linecolor="#0d1117", cbar_kws={"label": "coint p-value"}, ax=ax)
ax.set_title("Same coint test, three windows: a 'cointegrated' verdict is not a property of the pair")
plt.tight_layout(); plt.show()

flips = []
for (a, b) in wp:
    f, s, _ = split_pvals(a, b)
    if (f < 0.05) != (s < 0.05):
        flips.append((f"{a}/{b}", f, s))
print("Verdict FLIPS between the two halves (cointegrated in one, not the other):")
for name, f, s in flips:
    print(f"  {name:20s} first half p={f:.3f}  ->  second half p={s:.3f}")
if not flips:
    print("  (none flipped this run - but with different windows they will)")
print("\nEvery 'cointegrated' label in this series is true ONLY in its window. There is no permanent tether.")
