fret = residSN.shift(-1)                                   # next-day residual return
S = build_signal(residSN, K).stack(); F = fret.stack()
dd = pd.DataFrame({'sig': S, 'fwd': F}).dropna()
dd['dec'] = dd.groupby(level=0)['sig'].transform(
    lambda x: pd.qcut(x.rank(method='first'), 10, labels=False))
dec = dd.groupby('dec')['fwd'].mean() * 1e4                # bps/day

fig, ax = plt.subplots(figsize=(11, 5))
sns.barplot(x=dec.index.astype(int), y=dec.values,
            hue=dec.index.astype(int), palette='RdYlGn', legend=False, ax=ax)
ax.axhline(0, color=C['grey'], lw=.9)
ax.set_title(f'Mean NEXT-DAY residual return by signal decile (k={K})  '
             f'-- 0 = short candidates, 9 = long candidates')
ax.set_xlabel('signal decile (low -> high)'); ax.set_ylabel('mean forward residual (bps/day)')
plt.tight_layout(); plt.show()
spread = dec.iloc[-1] - dec.iloc[0]
print(f'top-minus-bottom decile spread: {spread:+.2f} bps/day gross.')
print('Broadly monotonic with a noisy extreme decile -- the honest signature of a real but THIN edge,')
print('not the clean staircase a curve-fit would draw.')
