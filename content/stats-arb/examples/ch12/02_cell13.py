fig, axes = plt.subplots(1, 2, figsize=(13, 4.8), sharex=True)
rs = np.arange(len(names))
for ax, stat, cv, ttl in [
    (axes[0], jr.lr1, jr.cvt[:, 1], 'Trace statistic vs 95% critical'),
    (axes[1], jr.lr2, jr.cvm[:, 1], 'Max-eigenvalue statistic vs 95% critical')]:
    cols = [C['green'] if s > c else C['grey'] for s, c in zip(stat, cv)]
    ax.bar(rs, stat, color=cols, width=0.62, label='test statistic')
    ax.plot(rs, cv, 'o--', color=C['red'], lw=1.6, ms=7, label='95% critical')
    for x, s, c in zip(rs, stat, cv):
        ax.text(x, s + 1.2, ('reject' if s > c else 'accept'), ha='center', fontsize=8.5,
                color=(C['green'] if s > c else C['grey']))
    ax.set_title(ttl); ax.set_xlabel('null hypothesis  rank <= r' if ax is axes[0] else 'rank r')
    ax.set_xticks(rs); ax.legend(fontsize=8.5)
axes[0].set_ylabel('statistic')
plt.tight_layout(); plt.show()
print(f'green bars (statistic above critical) = ranks we reject. trace -> r={r_trace}, maxeig -> r={r_maxeig}.')
