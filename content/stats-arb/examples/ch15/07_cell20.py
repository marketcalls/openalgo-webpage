def net_sharpe_cfg(entry, ex, w, sl=None):
    r = daily_net(beta0, entry=entry, ex=ex, w=w)
    return sharpe(r if sl is None else r.loc[sl])

en_ax = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5]
ex_ax = [-0.5, 0.0, 0.5, 1.0, 1.5]
w_ax  = [15, 20, 30, 45, 60, 90, 120]

H1 = np.array([[net_sharpe_cfg(e, x, W) for x in ex_ax] for e in en_ax])           # entry x exit
H2 = np.array([[net_sharpe_cfg(e, EXIT, w) for e in en_ax] for w in w_ax])         # window x entry

fig, (a1, a2) = plt.subplots(1, 2, figsize=(13.5, 5.2))
vmax = np.nanmax(np.abs(np.concatenate([H1.ravel(), H2.ravel()])))
sns.heatmap(H1, ax=a1, xticklabels=ex_ax, yticklabels=en_ax, annot=True, fmt='.2f', cmap='RdYlGn',
            center=0, vmin=-vmax, vmax=vmax, cbar_kws=dict(label='net Sharpe (full sample)'))
a1.set_xlabel('exit threshold (z)'); a1.set_ylabel('entry threshold (z)'); a1.set_title('Net Sharpe across entry x exit')
a1.add_patch(plt.Rectangle((ex_ax.index(EXIT), en_ax.index(ENTRY)), 1, 1, fill=False, edgecolor='black', lw=2.5))

sns.heatmap(H2, ax=a2, xticklabels=en_ax, yticklabels=w_ax, annot=True, fmt='.2f', cmap='RdYlGn',
            center=0, vmin=-vmax, vmax=vmax, cbar_kws=dict(label='net Sharpe (full sample)'))
a2.set_xlabel('entry threshold (z)'); a2.set_ylabel('z-score window (days)'); a2.set_title('Net Sharpe across window x entry')
a2.add_patch(plt.Rectangle((en_ax.index(ENTRY), w_ax.index(W)), 1, 1, fill=False, edgecolor='black', lw=2.5))
plt.tight_layout(); plt.show()

base = net_sharpe_cfg(ENTRY, EXIT, W)
ie, ix = en_ax.index(ENTRY), ex_ax.index(EXIT)
neigh = [H1[i, j] for i in range(max(0, ie-1), min(len(en_ax), ie+2))
                  for j in range(max(0, ix-1), min(len(ex_ax), ix+2))]
neigh_mean = np.nanmean(neigh); neigh_std = np.nanstd(neigh)
frac_pos = np.mean(np.concatenate([H1.ravel(), H2.ravel()]) > 0)
print(f'base config net Sharpe {base:.2f}; its 3x3 neighbourhood mean {neigh_mean:.2f} (sd {neigh_std:.2f}).')
print(f'{frac_pos:.0%} of all swept cells have positive net Sharpe -- a broad, low ridge rather than one bright spike.')
print(f'verdict: {"PLATEAU-like (robust to small changes)" if base-neigh_mean < neigh_std+0.15 else "RIDGE-like (fragile)"}, '
      f'but a low one -- robustness of a marginal edge is still a marginal edge.')
