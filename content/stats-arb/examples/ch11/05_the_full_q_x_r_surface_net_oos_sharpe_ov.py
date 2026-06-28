# the full Q x R surface: net OOS Sharpe over a grid of (delta, R)
d_grid = [1e-6, 1e-5, 1e-4, 5e-4, 1e-3]
r_grid = [1e-4, 1e-3, 1e-2, 1e-1]
grid = np.zeros((len(d_grid), len(r_grid)))
for i, d in enumerate(d_grid):
    for j, r in enumerate(r_grid):
        kfd = kalman_hedge(A, B, delta=d, R=r)
        spd = kfd['spread'].copy(); spd.iloc[:60] = np.nan
        btd = backtest(zscore(spd), kfd['beta'])
        grid[i, j] = perf(btd['net'], OOS0, OOS1)[0]
gridf = pd.DataFrame(grid, index=[f'{d:.0e}' for d in d_grid], columns=[f'{r:.0e}' for r in r_grid])

fig, ax = plt.subplots(figsize=(8.6, 5.4))
vmax = np.abs(grid).max()
sns.heatmap(gridf, annot=True, fmt='+.2f', cmap='vlag', center=0, vmin=-vmax, vmax=vmax,
            linewidths=0.5, cbar_kws={'label': 'net OOS Sharpe'}, ax=ax)
ax.set_xlabel('R  (observation noise)'); ax.set_ylabel('delta  (process noise)')
ax.set_title(f'Net OOS Sharpe across the Q x R tuning grid\n(static beta OOS net = {stat_oos:+.2f}; '
             f'grid spans {grid.min():+.2f} to {grid.max():+.2f})')
plt.tight_layout(); plt.show()
better = (grid > stat_oos).sum()
print(f'cells in the {grid.size}-point grid that beat the static OOS net Sharpe of {stat_oos:+.2f}: {better}')
print('The result is a landscape with hills and pits, not a number. Picking the best cell after the')
print('fact is curve-fitting; an honest forward test would have to fix delta and R *before* seeing OOS.')
