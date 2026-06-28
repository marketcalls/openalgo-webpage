from scipy import stats as _st
fig, (axl, axr) = plt.subplots(1, 2, figsize=(13, 4.8))
sns.kdeplot(port.values, fill=True, color=C['purple'], alpha=0.35, lw=2, ax=axl)
sns.rugplot(port.values, color=C['purple'], alpha=0.2, height=0.04, ax=axl)
axl.axvline(mu, color=C['grey'], ls='--', lw=1.1)
for k, cc in [(1, C['amber']), (2, C['red'])]:
    axl.axvline(mu + k*sd, color=cc, ls=':', lw=1.0); axl.axvline(mu - k*sd, color=cc, ls=':', lw=1.0)
axl.set_title(f'Basket distribution  (skew {_st.skew(port):+.2f}, exc.kurt {_st.kurtosis(port):+.2f})')
axl.set_xlabel('basket (log)')

sns.regplot(x=h['sl'].values, y=h['ds'].values, ax=axr,
            scatter_kws=dict(s=9, alpha=0.25, color=C['grey']), line_kws=dict(color=C['red'], lw=2.3))
axr.axhline(0, color=C['grey'], lw=0.8, ls=':'); axr.axvline(mu, color=C['grey'], lw=0.8, ls=':')
axr.set_title(f'AR(1) reversion: slope phi = {h["phi"]:.3f} < 0  ->  half-life {h["hl"]:.0f}d')
axr.set_xlabel('basket level  s(t-1)'); axr.set_ylabel('next-day change  ds(t)')
plt.tight_layout(); plt.show()

# autocorrelation of the spread: should decay, not persist like a random walk
ac = [port.autocorr(lag=l) for l in range(1, 21)]
print('spread autocorrelation, lags 1..5:', np.round(ac[:5], 3))
print(f'lag-1 autocorr {ac[0]:.3f}; a half-life of {h["hl"]:.0f}d implies lag-1 ~ {np.exp(-np.log(2)/h["hl"]):.3f} (consistent if close)')
