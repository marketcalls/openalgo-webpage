
# The scatter that kills the myth: correlation (x) vs coint p-value (y), all same-sector pairs.
from scipy.stats import spearmanr
pts = []
for sec, names in SECTORS.items():
    names = [s for s in names if s in px.columns]
    for a, b in itertools.combinations(names, 2):
        c, p, n = pair_stats(a, b)
        if n >= 750:                      # need ~3y of overlap for the test to mean anything
            pts.append(dict(pair=f"{a}/{b}", sector=sec, corr=c, p=p, n=n,
                            coint=(p < 0.05)))
sc = pd.DataFrame(pts)
rho, prho = spearmanr(sc["corr"], sc["p"])

fig, ax = plt.subplots(figsize=(11.5, 6.2))
sns.scatterplot(data=sc, x="corr", y="p", hue="coint", style="coint", s=90,
                palette={True: C["green"], False: C["grey"]}, ax=ax)
ax.axhline(0.05, color=C["red"], ls="--", lw=1.2)
ax.text(sc["corr"].min(), 0.065, "p = 0.05 (cointegrated below this line)", color=C["red"], fontsize=9)
# label the extremes so the point is unmissable
for _, r in sc.sort_values("corr", ascending=False).head(3).iterrows():
    ax.annotate(r["pair"], (r["corr"], r["p"]), fontsize=8, color=C["amber"],
                xytext=(4, 4), textcoords="offset points")
for _, r in sc[sc.coint].sort_values("corr").head(2).iterrows():
    ax.annotate(r["pair"], (r["corr"], r["p"]), fontsize=8, color=C["green"],
                xytext=(4, -10), textcoords="offset points")
ax.set_title(f"Same-sector pairs: correlation tells you almost nothing about cointegration "
             f"(this window)\nSpearman(corr, p) = {rho:+.2f}, n = {len(sc)} pairs")
ax.set_xlabel("return correlation"); ax.set_ylabel("Engle-Granger coint p-value")
ax.legend(title="cointegrated (p<0.05)", loc="upper left")
plt.tight_layout(); plt.show()
print(f"{len(sc)} same-sector pairs tested. Cointegrated at 5%: {sc.coint.sum()}.")
print(f"Spearman rank corr between correlation and coint p-value = {rho:+.2f} (p={prho:.2f}).")
print("Near zero: a higher correlation does NOT push the cointegration p-value down. They are different questions.")
