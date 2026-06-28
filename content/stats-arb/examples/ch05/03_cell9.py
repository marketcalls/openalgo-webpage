STOCK = 'RELIANCE'
px_s  = load(STOCK)['close'].dropna()
logp  = np.log(px_s)
ret   = logp.diff().dropna()          # daily log returns = I(0) candidate
print(f"{STOCK}: {len(px_s)} daily closes, {px_s.index.min().date()} -> {px_s.index.max().date()}")

fig, ax = plt.subplots(2, 1, figsize=(12, 7), sharex=True)
ax[0].plot(px_s.index, px_s.values, color=C['blue'], lw=1.2)
ax[0].set_title(f'{STOCK} close price - wanders like a random walk [I(1)]')
ax[0].set_ylabel('price (Rs)')
ax[1].plot(ret.index, ret.values, color=C['amber'], lw=0.7)
ax[1].axhline(ret.mean(), color=C['red'], lw=1.2, label=f'mean = {ret.mean():.5f}')
ax[1].set_title(f'{STOCK} daily log returns - a stationary cloud around ~0 [I(0)]')
ax[1].set_ylabel('log return'); ax[1].legend(fontsize=9)
plt.tight_layout(); plt.show()
