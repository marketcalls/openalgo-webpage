# ---- deterministic split diagram + leak fraction ---------------------------
M = len(idx); KF = 6
bounds = np.linspace(0, M, KF+1).astype(int)
EMB = int(round(0.01 * M))
hi_fold = 3                                            # the fold we highlight
t0, t1 = bounds[hi_fold], bounds[hi_fold+1]
plo, phi = max(0, t0-H), min(M, t1+H)                  # purge bands
elo, ehi = phi, min(M, phi+EMB)                        # embargo after test

fig, ax = plt.subplots(figsize=(13, 2.7))
ax.axvspan(0, M, color=C['blue'], alpha=0.18)                       # train base
ax.axvspan(plo, t0, color=C['grey'], alpha=0.55)                    # purge left
ax.axvspan(t0, t1, color=C['red'],  alpha=0.55)                     # test
ax.axvspan(t1, phi, color=C['grey'], alpha=0.55)                    # purge right
ax.axvspan(elo, ehi, color=C['amber'], alpha=0.55)                  # embargo
for b in bounds: ax.axvline(b, color=C['grey'], lw=0.7, ls=':')
ax.set_yticks([]); ax.set_xlim(0, M); ax.set_xlabel('observation index (time ->)')
ax.set_title(f'Purged & embargoed k-fold (k={KF}): one test fold, purge +/-{H}d, embargo {EMB}d')
from matplotlib.patches import Patch
ax.legend(handles=[Patch(color=C['blue'], alpha=0.18, label='train'), Patch(color=C['red'], alpha=0.55, label='test'),
                   Patch(color=C['grey'], alpha=0.55, label='purged'), Patch(color=C['amber'], alpha=0.55, label='embargo')],
          ncol=4, fontsize=9, loc='upper center', bbox_to_anchor=(0.5, -0.32))
plt.tight_layout(); plt.show()

def leak_fraction(train_mask, test_mask, h=H):
    present = np.zeros(M, bool); present[np.where(train_mask)[0]] = True
    pre = np.concatenate([[0], np.cumsum(present)])
    te = np.where(test_mask)[0]
    hit = sum(1 for t in te if pre[min(M, t+h+1)] - pre[max(0, t-h)] > 0)
    return hit / len(te)

rng = np.random.default_rng(7)
# shuffled k-fold (one realisation), blocked k-fold, purged+embargo -- average leak over folds
def scheme_leak(kind):
    fr = []
    if kind == 'shuffled':
        lab = rng.integers(0, KF, M)
        for f in range(KF):
            fr.append(leak_fraction(lab != f, lab == f))
    else:
        for f in range(KF):
            a, b = bounds[f], bounds[f+1]; test = np.zeros(M, bool); test[a:b] = True
            train = ~test
            if kind == 'purged':
                lo, h2 = max(0, a-H), min(M, b+H+EMB); train[lo:h2] = False
            fr.append(leak_fraction(train, test))
    return np.mean(fr)
leak_shuf, leak_block, leak_purg = scheme_leak('shuffled'), scheme_leak('blocked'), scheme_leak('purged')
print(f'avg fraction of TEST days with a TRAIN neighbour inside +/-{H}d (the leak):')
print(f'  shuffled k-fold       : {leak_shuf:.1%}   (near-duplicates everywhere)')
print(f'  blocked  k-fold       : {leak_block:.1%}   (only at fold edges)')
print(f'  purged + embargo      : {leak_purg:.1%}   (cut by construction)')
