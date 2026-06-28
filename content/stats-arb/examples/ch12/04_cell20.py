port = pd.Series(logpx.values @ v, index=logpx.index, name='basket')
mu, sd = port.mean(), port.std()
z = (port - mu) / sd

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7), sharex=True)
sns.lineplot(x=port.index, y=port.values, color=C['purple'], lw=1.1, ax=ax1)
ax1.axhline(mu, color=C['grey'], ls='--', lw=1.1, label='mean')
for k, cc in [(1, C['amber']), (2, C['red'])]:
    ax1.axhline(mu + k*sd, color=cc, ls=':', lw=1.0); ax1.axhline(mu - k*sd, color=cc, ls=':', lw=1.0)
ax1.fill_between(port.index, mu-sd, mu+sd, color=C['amber'], alpha=0.06)
ax1.set_title(f'Basket spread  =  vector . log-prices   ({WIN0[:4]}-{WIN1[:4]})'); ax1.set_ylabel('basket (log)')
ax1.legend(fontsize=8, loc='upper left')

sns.lineplot(x=z.index, y=z.values, color=C['blue'], lw=1.0, ax=ax2)
for k, cc in [(1, C['amber']), (2, C['red'])]:
    ax2.axhline(k, color=cc, ls=':', lw=1.0); ax2.axhline(-k, color=cc, ls=':', lw=1.0)
ax2.axhline(0, color=C['grey'], ls='--', lw=1.0)
ax2.fill_between(z.index, -1, 1, color=C['green'], alpha=0.05)
ax2.set_title('Basket z-score (entry/exit zones)'); ax2.set_ylabel('z'); ax2.set_xlabel('')
plt.tight_layout(); plt.show()

crossings = int((np.sign(z - 0).diff() != 0).sum())
print(f'mean crossings in-window: {crossings}  (a reverting basket crosses its mean often)')
