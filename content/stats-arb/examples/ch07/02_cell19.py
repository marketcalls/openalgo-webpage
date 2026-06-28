alpha, beta = ols_ab.params['const'], b_ab
spread = A - (alpha + beta * B)
spread.name = 'spread'
mu, sd = spread.mean(), spread.std()

fig, ax = plt.subplots(figsize=(12, 4.8))
sns.lineplot(x=spread.index, y=spread.values, color=C['purple'], lw=1.1, ax=ax)
ax.axhline(mu, color=C['grey'], lw=1.2, ls='--', label='mean')
for k, c in [(1, C['amber']), (2, C['red'])]:
    ax.axhline(mu + k*sd, color=c, lw=1.0, ls=':', label=f'+/- {k} sd')
    ax.axhline(mu - k*sd, color=c, lw=1.0, ls=':')
ax.fill_between(spread.index, mu-sd, mu+sd, color=C['amber'], alpha=0.06)
ax.set_title(f'Spread  {A_name} - {beta:.3f}*{B_name}   (log scale, {WIN0[:4]}-{WIN1[:4]})')
ax.set_ylabel('spread (log)'); ax.legend(ncol=5, fontsize=8, loc='upper left')
plt.tight_layout(); plt.show()
print(f'spread mean = {mu:.5f} (OLS forces it to ~0)   sd = {sd:.5f}')
print(f'times it crossed its mean in-window: {(np.sign(spread-mu).diff()!=0).sum()}  '
      f'(a reverting spread crosses often)')
