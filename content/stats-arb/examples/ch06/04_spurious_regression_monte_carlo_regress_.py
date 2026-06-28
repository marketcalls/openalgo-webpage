
# Spurious regression Monte Carlo: regress INDEPENDENT random walks on each other.
rng = np.random.default_rng(7)
N, T = 3000, 500
tstat = np.empty(N); r2 = np.empty(N); pval = np.empty(N)
for i in range(N):
    x = np.cumsum(rng.standard_normal(T))     # random walk 1
    y = np.cumsum(rng.standard_normal(T))     # random walk 2 - totally unrelated
    m = sm.OLS(y, sm.add_constant(x)).fit()
    tstat[i] = m.tvalues[1]; r2[i] = m.rsquared; pval[i] = m.pvalues[1]

frac_sig = (np.abs(tstat) > 1.96).mean()
frac_r2  = (r2 > 0.5).mean()

fig, ax = plt.subplots(1, 2, figsize=(13, 4.8))
sns.histplot(tstat, bins=60, color=C["purple"], ax=ax[0])
for k in (-1.96, 1.96):
    ax[0].axvline(k, color=C["red"], ls="--", lw=1.2)
ax[0].set_title(f"t-stat of the slope ({N} unrelated random-walk pairs)\n"
                f"|t| > 1.96 in {frac_sig*100:.0f}% of cases - 'significant' is the DEFAULT")
ax[0].set_xlabel("t-statistic")
sns.histplot(r2, bins=50, color=C["teal"], ax=ax[1])
ax[1].axvline(0.5, color=C["red"], ls="--", lw=1.2)
ax[1].set_title(f"R-squared of the same regressions\n"
                f"R-squared > 0.5 in {frac_r2*100:.0f}% of cases - on pure noise")
ax[1].set_xlabel("R-squared")
plt.tight_layout(); plt.show()

print(f"Out of {N} pairs of INDEPENDENT random walks (seeded):")
print(f"  'statistically significant' slope (|t|>1.96): {frac_sig*100:.1f}%   (a correct test would give ~5%)")
print(f"  R-squared above 0.5                         : {frac_r2*100:.1f}%")
print(f"  median |t-stat|                             : {np.median(np.abs(tstat)):.1f}")
print("This is why a correlation/regression screen on raw prices invents relationships. Cointegration is the antidote.")
