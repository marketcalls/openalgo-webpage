# rolling mean and rolling std of returns: mean pinned near 0, variance wobbles (vol clustering)
w = 63   # ~one quarter
rm = ret.rolling(w).mean(); rs = ret.rolling(w).std()
fig, ax = plt.subplots(2, 1, figsize=(12, 6), sharex=True)
ax[0].plot(rm.index, rm.values, color=C['blue']); ax[0].axhline(0, color=C['grey'], ls='--', lw=1)
ax[0].axhline(ret.mean(), color=C['red'], lw=1, label=f'full-sample mean {ret.mean():.5f}')
ax[0].set_title(f'{STOCK}: rolling {w}-day mean return stays pinned near zero (stationary mean)')
ax[0].legend(fontsize=9)
ax[1].plot(rs.index, rs.values, color=C['purple'])
ax[1].axhline(ret.std(), color=C['red'], lw=1, label=f'full-sample std {ret.std():.4f}')
ax[1].set_title(f'{STOCK}: rolling {w}-day std wobbles (volatility clustering, not non-stationarity)')
ax[1].legend(fontsize=9)
plt.tight_layout(); plt.show()
# compare first-half vs second-half moments: stable mean/var = consistent with stationarity
half = len(ret)//2
print("returns, first half  : mean=%+.5f  std=%.4f" % (ret.iloc[:half].mean(), ret.iloc[:half].std()))
print("returns, second half : mean=%+.5f  std=%.4f" % (ret.iloc[half:].mean(), ret.iloc[half:].std()))
print("log-price, first half: mean=%6.3f  | second half: mean=%6.3f  (level mean shifts -> non-stationary)"
      % (logp.iloc[:half].mean(), logp.iloc[half:].mean()))
