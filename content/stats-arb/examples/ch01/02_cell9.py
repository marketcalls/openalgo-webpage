A, B, sec = cand.loc[0, 'A'], cand.loc[0, 'B'], cand.loc[0, 'sector']
pair = px[[A, B]].dropna()
reb  = pair / pair.iloc[0] * 100

# hedge ratio from OLS on log prices: log A = alpha + beta * log B + spread
lp = np.log(pair)
res   = sm.OLS(lp[A], sm.add_constant(lp[B])).fit()
alpha, beta = res.params['const'], res.params[B]
spread = lp[A] - (alpha + beta * lp[B])
adf_p  = adfuller(spread.dropna())[1]
hl     = half_life(spread)

print(f'Pair chosen by the data : {A}  vs  {B}   (sector: {sec})')
print(f'window                  : {pair.index.min().date()} -> {pair.index.max().date()}  ({len(pair)} days)')
print(f'daily-return corr       : {cand.loc[0, "ret_corr"]:.3f}')
print(f'OLS hedge ratio beta    : {beta:.3f}   (units of log {B} per unit log {A})')
print(f'ADF p-value on spread   : {adf_p:.3f}   ({"stationary at 5%" if adf_p < 0.05 else "CANNOT reject random walk -- not clean"})')
print(f'spread half-life        : {hl:.0f} days')

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 7), sharex=True)
ax1.plot(reb.index, reb[A], color=C['blue'],  lw=1.4, label=A)
ax1.plot(reb.index, reb[B], color=C['amber'], lw=1.4, label=B)
ax1.set_title(f'{A} vs {B}: rebased to 100 -- they travel together, but not in lockstep'); ax1.legend(loc='upper left')
ax2.plot(spread.index, spread, color=C['green'], lw=1.1)
ax2.axhline(spread.mean(), color='w', lw=1, ls='--')
ax2.axhline(spread.mean()+2*spread.std(), color=C['red'], lw=0.9, ls=':')
ax2.axhline(spread.mean()-2*spread.std(), color=C['red'], lw=0.9, ls=':')
ax2.set_title('Log-price spread (OLS residual): real mean reversion, but messier and prone to regime shifts')
plt.tight_layout(); plt.show()
