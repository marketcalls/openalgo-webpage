from sklearn.covariance import LedoitWolf

Uvt   = U.mul(lev, axis=1)                     # always-on 1-unit spread returns, vol-targeted (equal diagonals)
Uvt_tr = Uvt.loc[TR0:TR1].fillna(0.0)         # diagonals ~equal, so what is left to estimate is the correlation
S_samp = Uvt_tr.cov().values
lwf    = LedoitWolf().fit(Uvt_tr.values)
S_lw   = lwf.covariance_
def corr_of(S):
    d = np.sqrt(np.diag(S)); return S / np.outer(d, d)

fig, axes = plt.subplots(1, 2, figsize=(13.5, 5.2))
for ax, M, ttl in [(axes[0], corr_of(S_samp), 'Sample correlation'),
                   (axes[1], corr_of(S_lw),  f'Ledoit-Wolf (shrinkage={lwf.shrinkage_:.2f})')]:
    sns.heatmap(M, ax=ax, xticklabels=BOOK, yticklabels=BOOK, annot=True, fmt='.2f',
                cmap='vlag', center=0, vmin=-1, vmax=1, cbar_kws=dict(label='corr'))
    ax.set_title(ttl); ax.tick_params(axis='x', rotation=90); ax.tick_params(axis='y', rotation=0)
plt.tight_layout(); plt.show()

# the honest test: condition number on SHORT rolling windows (what a desk re-estimates on)
cs, cl = [], []
for i in range(63, len(Uvt), 21):
    win = Uvt.iloc[i-63:i].fillna(0.0)
    try:
        cs.append(np.linalg.cond(win.cov().values))
        cl.append(np.linalg.cond(LedoitWolf().fit(win.values).covariance_))
    except Exception: pass
print(f'condition number, full train window : sample {np.linalg.cond(S_samp):5.1f}   Ledoit-Wolf {np.linalg.cond(S_lw):5.1f}')
print(f'condition number, 63-day windows med : sample {np.median(cs):5.1f}   Ledoit-Wolf {np.median(cl):5.1f}')
print(f'condition number, 63-day windows max : sample {np.max(cs):5.1f}   Ledoit-Wolf {np.max(cl):5.1f}')
print('higher condition number = closer to singular = the optimizer amplifies noise. Shrinkage keeps it tame.')
