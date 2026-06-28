# ---- naive (shuffled) vs purged+embargo CV Sharpe, on the OVERLAPPING reversion label -------
cs = np.cumsum(rpair.fillna(0).values); n = len(cs)
fwd = np.full(n, np.nan)
for i in range(n):
    if i + H < n: fwd[i] = cs[i+H] - cs[i]                 # forward H-day spread return
bet = -np.sign(z0.values)                                  # reversion bet direction
outcome = bet * fwd                                        # overlapping H-day outcome
valid = ~np.isnan(z0.values) & ~np.isnan(fwd)
ivd = np.where(valid)[0]
Zv, OUT, POS = np.abs(z0.values[ivd]), outcome[ivd], ivd
m, TAUS = len(ivd), [0.5, 1.0, 1.5, 2.0, 2.5]

def cv_score(IS, OO):
    """Select the entry threshold on IS (max IS reversion-Sharpe), score it on OO."""
    best, bt = -9, TAUS[0]
    for t in TAUS:
        mt = Zv[IS] > t
        if mt.sum() < 40: continue
        o = OUT[IS][mt]; sc = o.mean()/o.std() if o.std() > 0 else -9
        if sc > best: best, bt = sc, t
    mo = Zv[OO] > bt
    if mo.sum() < 20: return np.nan
    o = OUT[OO][mo]
    return o.mean()/o.std()*np.sqrt(ANN/H) if o.std() > 0 else np.nan

rng2 = np.random.default_rng(3)
def cv_shuffled(k=6, reps=60):
    out = []
    for _ in range(reps):
        lab = rng2.integers(0, k, m)
        for f in range(k):
            out.append(cv_score(np.where(lab != f)[0], np.where(lab == f)[0]))
    return np.array(out)
def cv_blocked(k=6, purge=0, emb=0, reps=60):
    out = []
    for _ in range(reps):
        off = rng2.integers(0, m); roll = (np.arange(m) + off) % m
        bb = np.linspace(0, m, k+1).astype(int)
        for f in range(k):
            a, b2 = bb[f], bb[f+1]; OO = roll[a:b2]
            lo, h2 = max(0, a-purge), min(m, b2+purge+emb)
            IS = np.r_[roll[0:lo], roll[h2:m]]
            out.append(cv_score(IS, OO))
    return np.array(out)

cv_naive  = cv_shuffled()
cv_block  = cv_blocked(6, 0, 0)
cv_purged = cv_blocked(6, H, EMB)
cv_naive_m, cv_block_m, cv_purged_m = np.nanmean(cv_naive), np.nanmean(cv_block), np.nanmean(cv_purged)

fig, (a1, a2) = plt.subplots(1, 2, figsize=(13, 4.8), gridspec_kw=dict(width_ratios=[2, 3]))
a1.bar(['shuffled\n(naive)', 'blocked', 'purged+\nembargo'], [leak_shuf, leak_block, leak_purg],
       color=[C['red'], C['amber'], C['green']])
a1.set_ylabel('leak fraction of test days'); a1.set_title('How much each scheme leaks'); a1.set_ylim(0, 1)
for i, v in enumerate([leak_shuf, leak_block, leak_purg]): a1.text(i, v+0.02, f'{v:.0%}', ha='center', fontweight='bold')

bars = a2.bar(['shuffled (naive)', 'blocked', 'purged+embargo'], [cv_naive_m, cv_block_m, cv_purged_m],
              color=[C['red'], C['amber'], C['green']])
a2.axhline(0, color=C['grey'], lw=1.0)
for bbar, v in zip(bars, [cv_naive_m, cv_block_m, cv_purged_m]):
    a2.text(bbar.get_x()+bbar.get_width()/2, v+0.02, f'{v:.2f}', ha='center', fontweight='bold')
a2.set_ylabel('cross-validated Sharpe'); a2.set_title('Naive CV inflates the Sharpe vs purged CV')
plt.tight_layout(); plt.show()

print(f'naive shuffled-CV Sharpe  {cv_naive_m:.2f}   ->   purged+embargo CV Sharpe  {cv_purged_m:.2f}   '
      f'({(cv_naive_m-cv_purged_m)/abs(cv_purged_m)*100:.0f}% inflation removed)')
print(f'the leak enters through the SHUFFLE (near-duplicate neighbours land in both train and test); moving to')
print(f'contiguous blocks and then purging + embargoing the overlap progressively removes it -- and the purge')
print(f'matters more the longer positions are held (here H={H}d).')
