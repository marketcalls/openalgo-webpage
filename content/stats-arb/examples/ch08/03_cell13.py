rng = np.random.default_rng(20260629)
K   = 6000                                   # pool of independent random-walk pairs
T   = int(scan.n_is.median())                # match the typical in-sample length
pmc = np.empty(K)
for i in range(K):
    x = np.cumsum(rng.standard_normal(T))    # random walk 1
    y = np.cumsum(rng.standard_normal(T))    # random walk 2 - totally unrelated
    pmc[i] = cp(x, y)

rate         = (pmc < 0.05).mean()
R            = K // m
blocks       = pmc[:R * m].reshape(R, m)
block_counts = (blocks < 0.05).sum(axis=1)   # passes per random scan of size m
exp_random   = rate * m
n_naive      = len(naive)

fig, ax = plt.subplots(1, 2, figsize=(13, 4.8))
ax[0].bar(["real scan\n(same-sector)", "random scan\n(independent RWs)"],
          [n_naive, block_counts.mean()],
          yerr=[0, block_counts.std()], capsize=7,
          color=[C["green"], C["grey"]])
ax[0].axhline(exp_random, color=C["red"], ls="--", lw=1.3)
ax[0].set_title(f"Pairs passing at p<0.05  (each scan tests m={m})")
ax[0].set_ylabel("pairs passing")
sns.histplot(block_counts, bins=range(0, int(block_counts.max()) + 2),
             color=C["amber"], ax=ax[1])
ax[1].axvline(exp_random, color=C["red"], ls="--", lw=1.4,
              label=f"noise mean = {exp_random:.1f}")
ax[1].axvline(n_naive, color=C["green"], lw=2.2, label=f"real scan = {n_naive}")
ax[1].set_title("False positives per scan from PURE NOISE")
ax[1].set_xlabel("pairs passing per random scan of m"); ax[1].legend()
plt.tight_layout(); plt.show()

print(f"Monte Carlo: {K} independent random-walk pairs (length T={T}), seed=20260629.")
print(f"  False-positive RATE at p<0.05 = {rate*100:.2f}%   (the test's size; nominal 5%).")
print(f"  Expected spurious 'cointegrated' pairs in a scan of m={m}: {exp_random:.1f}.")
print(f"  Real same-sector scan found {n_naive}  ->  about {max(n_naive-exp_random,0):.1f} above the noise floor.")
print("So a chunk of the naive winners are statistically indistinguishable from coin flips.")
