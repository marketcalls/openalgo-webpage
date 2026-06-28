def rolling_beta(A, B, w=120):
    """Trailing-window OLS slope of A on B, using only data up to each point (no look-ahead)."""
    idx, out = A.index, []
    Av, Bv = A.values, B.values
    for i in range(w, len(A)):
        bb = np.polyfit(Bv[i-w:i], Av[i-w:i], 1)[0]
        out.append((idx[i], bb))
    return pd.Series(dict(out))

rb = rolling_beta(A, B, w=120)
fig, ax = plt.subplots(figsize=(12, 4.8))
sns.lineplot(x=rb.index, y=rb.values, color=C['teal'], lw=1.6, ax=ax, label='rolling 120d OLS beta')
ax.axhline(b_ab,  color=C['amber'], ls='--', lw=1.4, label=f'full-window OLS beta = {b_ab:.3f}')
ax.axhline(b_tls, color=C['green'], ls=':',  lw=1.4, label=f'full-window TLS beta = {b_tls:.3f}')
ax.fill_between(rb.index, rb.mean()-rb.std(), rb.mean()+rb.std(), color=C['teal'], alpha=0.08)
ax.set_title('The "constant" hedge ratio is not constant'); ax.set_ylabel('hedge ratio beta')
ax.legend(fontsize=8, ncol=3, loc='upper left')
plt.tight_layout(); plt.show()
print(f'rolling beta: min {rb.min():.3f}  max {rb.max():.3f}  mean {rb.mean():.3f}  sd {rb.std():.3f}')
print(f'range as a fraction of the mean: {(rb.max()-rb.min())/abs(rb.mean())*100:.0f}%  '
      f'-- a single fixed beta hides a lot of drift')
