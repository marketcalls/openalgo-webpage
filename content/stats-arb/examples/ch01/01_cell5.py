from statsmodels.tsa.stattools import adfuller

def half_life(series):
    """Days to revert half a deviation, from an AR(1) fit: delta_t = a + b*level_{t-1}."""
    s = pd.Series(series).dropna().values
    lag, delta = s[:-1], np.diff(s)
    b = np.polyfit(lag, delta, 1)[0]
    return -np.log(2) / np.log(1 + b) if b < 0 else np.nan

rng = np.random.default_rng(7)
n = 750                                            # ~3 trading years
common = 100 + np.cumsum(rng.normal(0, 1.0, n))    # shared random-walk trend
phi, sig = 0.93, 1.2                               # AR(1): slow mean reversion
s = np.zeros(n)
for t in range(1, n):
    s[t] = phi * s[t-1] + rng.normal(0, sig)       # mean-reverting wobble
X = common + rng.normal(0, 0.4, n)                 # price A: trend + tiny noise
Y = common + s                                     # price B: trend + wobble
spread = Y - X
idx = pd.bdate_range('2023-01-02', periods=n)

p_X      = adfuller(X)[1]
p_spread = adfuller(spread)[1]
print(f'ADF p-value on price X     : {p_X:6.3f}  (high -> cannot reject random walk -> NON-stationary)')
print(f'ADF p-value on the spread  : {p_spread:6.3f}  (low  -> reject random walk -> STATIONARY)')
print(f'spread half-life           : {half_life(spread):6.1f} days')

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 7), sharex=True)
ax1.plot(idx, X, color=C['blue'],  lw=1.6, label='X = trend + noise')
ax1.plot(idx, Y, color=C['amber'], lw=1.6, label='Y = trend + wobble')
ax1.set_title('Two synthetic prices: both wander like random walks'); ax1.legend(loc='upper left')
ax2.plot(idx, spread, color=C['green'], lw=1.4)
ax2.axhline(spread.mean(), color='w', lw=1, ls='--')
ax2.axhline(spread.mean()+2*spread.std(), color=C['red'], lw=0.9, ls=':')
ax2.axhline(spread.mean()-2*spread.std(), color=C['red'], lw=0.9, ls=':')
ax2.set_title('Their spread (Y - X): flat, mean-reverting, stationary  -- this is what we trade')
plt.tight_layout(); plt.show()
