def half_life(s):
    s = pd.Series(s).dropna(); ds = s.diff().dropna(); sl = s.shift(1).dropna()
    sl, ds = sl.align(ds, join='inner')
    kappa = -sm.OLS(ds, sm.add_constant(sl)).fit().params.iloc[1]
    return np.log(2) / kappa if kappa > 0 else np.nan

HL = half_life(spread)
Z_WIN = int(round(HL))                                  # rolling window ~= one half-life
print(f'half-life (notebook 04 method) = {HL:.1f} days  ->  rolling z-score window Z_WIN = {Z_WIN} days')

roll_mean = spread.rolling(Z_WIN).mean()
roll_std  = spread.rolling(Z_WIN).std()
z = ((spread - roll_mean) / roll_std).rename('z')

roll_med = spread.rolling(Z_WIN).median()
roll_mad = spread.rolling(Z_WIN).apply(lambda a: np.median(np.abs(a - np.median(a))), raw=True)
z_robust = ((spread - roll_med) / (1.4826 * roll_mad)).rename('z_robust')

print(f'z (mean/std): mean {z.mean():+.2f}  sd {z.std():.2f}   |   '
      f'z_robust (median/MAD): mean {z_robust.mean():+.2f}  sd {z_robust.std():.2f}')
print(f'correlation between the two z-scores: {z.corr(z_robust):.3f}  '
      f'(close, but the robust one is calmer through gaps)')

fig, ax = plt.subplots(figsize=(12, 4.6))
sns.lineplot(x=z.index, y=z.values, color=C['blue'], lw=1.0, ax=ax, label='z (rolling mean/std)')
sns.lineplot(x=z_robust.index, y=z_robust.values, color=C['amber'], lw=1.0, ax=ax, label='z robust (median/MAD)')
for lvl in [2, -2, 3.5, -3.5]: ax.axhline(lvl, color=C['grey'], ls=':', lw=0.8)
ax.axhline(0, color=C['grey'], ls='--', lw=0.8)
ax.set_title(f'Two z-scores of the {A_name}-{B_name} spread (window {Z_WIN}d ~ one half-life)')
ax.set_ylabel('z'); ax.legend(fontsize=9, ncol=2, loc='upper left')
plt.tight_layout(); plt.show()
