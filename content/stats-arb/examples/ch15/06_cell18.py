def stationary_bootstrap_sharpe(r, B=3000, mean_block=20, seed=11):
    r = pd.Series(r).dropna().values; n = len(r); p = 1.0/mean_block
    rng = np.random.default_rng(seed)
    idxb = rng.integers(0, n, size=B); out = np.empty((B, n)); out[:, 0] = r[idxb]
    for t in range(1, n):
        restart = rng.random(B) < p
        idxb = np.where(restart, rng.integers(0, n, size=B), (idxb + 1) % n)
        out[:, t] = r[idxb]
    mu, sd = out.mean(1), out.std(1)
    return mu/np.where(sd > 0, sd, np.nan)*np.sqrt(ANN)

boot_oos  = stationary_bootstrap_sharpe(r_oos)
boot_full = stationary_bootstrap_sharpe(r_base)
ci_lo, ci_hi = np.nanpercentile(boot_oos, [2.5, 97.5])
ci_lo_f, ci_hi_f = np.nanpercentile(boot_full, [2.5, 97.5])
p_neg = float((boot_oos < 0).mean())
sr_point = sharpe(r_oos)

fig, ax = plt.subplots(figsize=(12, 5.0))
sns.histplot(boot_full, bins=60, stat='density', color=C['grey'], alpha=0.35, ax=ax, label=f'full sample (CI [{ci_lo_f:.2f}, {ci_hi_f:.2f}])')
sns.histplot(boot_oos,  bins=60, stat='density', color=C['blue'], alpha=0.55, ax=ax, label=f'out-of-sample (CI [{ci_lo:.2f}, {ci_hi:.2f}])')
ax.axvline(0, color=C['red'], lw=2.2, ls='-', label='zero')
ax.axvline(sr_point, color=C['green'], lw=2.0, ls='--', label=f'OOS point estimate {sr_point:.2f}')
ax.axvspan(ci_lo, ci_hi, color=C['blue'], alpha=0.06)
ax.set_xlabel('bootstrapped annualised Sharpe'); ax.set_ylabel('density')
ax.set_title('Stationary block bootstrap of the Sharpe -- is zero inside the interval?')
ax.legend(fontsize=9, loc='upper left')
plt.tight_layout(); plt.show()

print(f'OUT-OF-SAMPLE Sharpe {sr_point:.2f}   95% bootstrap CI [{ci_lo:.2f}, {ci_hi:.2f}]   '
      f'P(Sharpe<0) = {p_neg:.0%}')
print(f'zero is {"INSIDE" if ci_lo < 0 < ci_hi else "outside"} the interval -- we cannot reject "no edge" at 5%.')
print(f'even the full-sample CI [{ci_lo_f:.2f}, {ci_hi_f:.2f}] is wide: the point Sharpe is far less certain than it looks.')
