R  = pd.DataFrame({k: allp[k]['strat'] for k in BOOK})    # signal-gated daily P&L per pair (1-unit)
U  = pd.DataFrame({k: allp[k]['unit']  for k in BOOK})    # always-on 1-unit spread return per pair
Hd = pd.DataFrame({k: allp[k]['held']  for k in BOOK})    # held position per pair

def eqc(r):  return (1 + pd.Series(r).fillna(0)).cumprod()
def perf(r):
    r = pd.Series(r).dropna()
    if len(r) < 5 or r.std() == 0: return dict(sharpe=np.nan, vol=np.nan, total=np.nan, maxdd=np.nan)
    eq = (1 + r).cumprod()
    return dict(sharpe=r.mean()/r.std()*np.sqrt(ANN), vol=r.std()*np.sqrt(ANN),
                total=eq.iloc[-1]-1, maxdd=(eq/eq.cummax()-1).min())

fig, axes = plt.subplots(2, 3, figsize=(13.5, 6.6), sharex=True)
for ax, k in zip(axes.ravel(), BOOK):
    e = eqc(R[k]); p = perf(R[k])
    ax.plot(e.index, e.values, color=C['blue'], lw=1.4)
    ax.axhline(1, color=C['grey'], ls=':', lw=0.8)
    ax.set_title(f"{k}\nSharpe {p['sharpe']:.2f}  |  {p['total']*100:+.0f}%", fontsize=10)
fig.suptitle('Six pairs, each traded alone (gross, next-bar fill) -- they earn at different times', fontsize=13, fontweight='bold')
plt.tight_layout(); plt.show()

corr_strat = R.corr()
print('average pairwise correlation of the gated pair returns: %.2f' % corr_strat.values[np.triu_indices(6,1)].mean())
