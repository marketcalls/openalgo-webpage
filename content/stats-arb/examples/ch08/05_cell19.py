stages = ["Candidate\nsame-sector pairs", "Naive  p<0.05",
          "BH-FDR survivors", "OOS-confirmed"]
counts = [m, n_naive, n_bh, n_final]
ypos   = np.arange(len(stages))[::-1]
cols   = [C["grey"], C["amber"], C["blue"], C["green"]]

fig, ax = plt.subplots(figsize=(10.5, 5))
ax.barh(ypos, counts, color=cols, height=0.62)
for y, c in zip(ypos, counts):
    ax.text(c + max(counts) * 0.012, y, str(c), va="center", fontweight="bold")
ax.set_yticks(ypos); ax.set_yticklabels(stages)
ax.set_xlabel("pairs surviving"); ax.set_xlim(0, max(counts) * 1.12)
ax.set_title("The honest funnel: prior -> test -> correct -> confirm OOS (this window)")
plt.tight_layout(); plt.show()

print("Survivors of the full disciplined pipeline (BH-FDR AND out-of-sample):")
final = bh_oos[bh_oos.holds_oos][["pair", "sector", "p_is", "p_oos"]]
if len(final):
    display(final.reset_index(drop=True))
else:
    print("  NONE this window: nothing that survives correction also confirms out-of-sample.")
print(f"\nStage counts (live): candidates={m}, naive={n_naive}, "
      f"Bonferroni={n_bonf}, BH-FDR={n_bh}, OOS-confirmed={n_final}.")
print("On a different in-sample/out-of-sample split these counts change - that fragility is the lesson.")
