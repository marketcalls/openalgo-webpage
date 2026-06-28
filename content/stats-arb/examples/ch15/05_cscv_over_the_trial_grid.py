# ---- CSCV over the trial grid ------------------------------------------------
S = 8
bnds = np.linspace(0, T, S+1).astype(int)
blocks = [np.arange(bnds[i], bnds[i+1]) for i in range(S)]
def blk_sharpe(rows):
    sub = Rmat[rows]; sd = sub.std(0)
    return np.where(sd > 0, sub.mean(0)/sd, np.nan)

lams, is_best_sr, oos_sel_sr = [], [], []
for combo in itertools.combinations(range(S), S//2):
    IS = np.concatenate([blocks[i] for i in combo])
    OO = np.concatenate([blocks[i] for i in range(S) if i not in combo])
    sis, soo = blk_sharpe(IS), blk_sharpe(OO)
    nstar = int(np.nanargmax(sis))
    rank = (np.sum(soo < soo[nstar]) + 1) / (np.sum(~np.isnan(soo)) + 1)   # relative OOS rank in (0,1)
    rank = min(max(rank, 1e-3), 1 - 1e-3)
    lams.append(np.log(rank/(1-rank)))
    is_best_sr.append(sis[nstar]*np.sqrt(ANN)); oos_sel_sr.append(soo[nstar]*np.sqrt(ANN))
lams = np.array(lams)
PBO = float((lams < 0).mean())

fig, (a1, a2) = plt.subplots(1, 2, figsize=(13, 4.9))
sns.histplot(lams, bins=18, kde=True, color=C['purple'], ax=a1)
a1.axvline(0, color=C['red'], ls='--', lw=1.6)
a1.fill_betweenx([0, a1.get_ylim()[1]], a1.get_xlim()[0], 0, color=C['red'], alpha=0.08)
a1.set_title(f'CSCV logit distribution -- PBO = P(logit<0) = {PBO:.0%}')
a1.set_xlabel('logit of OOS rank of the IS-best config'); a1.set_ylabel('count of splits')

a2.scatter(is_best_sr, oos_sel_sr, s=28, color=C['amber'], edgecolor=C['grey'], alpha=0.8)
lim = [min(is_best_sr+oos_sel_sr)-0.2, max(is_best_sr+oos_sel_sr)+0.2]
a2.plot(lim, lim, color=C['grey'], ls='--', lw=1.0, label='IS = OOS')
a2.axhline(0, color=C['red'], ls=':', lw=1.0)
a2.set_xlim(lim); a2.set_ylim(lim)
a2.set_xlabel('IS Sharpe of the chosen config'); a2.set_ylabel('OOS Sharpe of that same config')
a2.set_title('In-sample winner vs its out-of-sample reality'); a2.legend(fontsize=9, loc='upper left')
plt.tight_layout(); plt.show()

print(f'CSCV: S={S} blocks, {len(lams)} symmetric splits, N={N_TRIALS} configs.')
print(f'Probability of Backtest Overfitting  PBO = {PBO:.0%}.')
print(f'median OOS Sharpe of the IS-best config: {np.median(oos_sel_sr):+.2f}  (vs its median IS Sharpe {np.median(is_best_sr):+.2f}).')
print('a PBO this high says: picking the best in-sample config is barely better than picking one at random.')
