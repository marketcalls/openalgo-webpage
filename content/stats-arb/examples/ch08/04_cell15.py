alpha   = 0.05
p       = scan.p_is.values
order   = np.argsort(p)
ps      = p[order]
names_s = scan.pair.values[order]
ranks   = np.arange(1, m + 1)

bonf_thr = alpha / m
bh_line  = alpha * ranks / m
passed   = ps <= bh_line
bh_cut   = ps[passed].max() if passed.any() else -np.inf

n_bonf = int((p < bonf_thr).sum())
n_bh   = int((p <= bh_cut).sum())

fig, ax = plt.subplots(figsize=(11.5, 6))
dot_col = [C["green"] if v <= bh_cut else C["grey"] for v in ps]
ax.scatter(ranks, ps, s=48, color=dot_col, zorder=3, edgecolor="#0d1117", linewidth=.5)
ax.plot(ranks, bh_line, color=C["blue"], lw=1.9, label="BH-FDR line:  i * alpha / m")
ax.axhline(bonf_thr, color=C["red"], ls="--", lw=1.6, label=f"Bonferroni:  alpha/m = {bonf_thr:.5f}")
ax.axhline(alpha, color=C["amber"], ls=":", lw=1.4, label="naive:  alpha = 0.05")
for rk, (pp, nm) in enumerate(zip(ps, names_s), start=1):
    if pp <= bh_cut:
        ax.annotate(nm, (rk, pp), fontsize=8, color=C["green"],
                    xytext=(5, 4), textcoords="offset points")
ax.set_ylim(0, 0.30); ax.set_xlabel("pair rank (sorted by p-value)")
ax.set_ylabel("in-sample cointegration p-value")
ax.set_title("Sorted p-values vs the multiple-testing thresholds (in-sample scan)")
ax.legend(loc="upper left")
plt.tight_layout(); plt.show()

bh_disp = bh_cut if np.isfinite(bh_cut) else float("nan")
print(f"m = {m} same-sector tests on the common in-sample window.")
print(f"  Naive     (p<0.05)          : {n_naive} pairs")
print(f"  Bonferroni (p<{bonf_thr:.5f})    : {n_bonf} pairs survive")
print(f"  BH-FDR    (q=0.05, cut p<={bh_disp:.4f}): {n_bh} pairs survive")
print("Notice how many 'winners' were really just the cost of running a big scan.")
