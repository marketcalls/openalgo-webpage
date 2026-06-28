BW = 120                                  # rolling-beta window (~6 months), past data only
def rolling_beta(y, x, w=BW):
    """Beta_t = Cov(y,x)/Var(x) over the trailing w days. Uses only data up to t."""
    return y.rolling(w).cov(x) / x.rolling(w).var()

betas = pd.DataFrame({s: rolling_beta(rets[s], mret) for s in names})
resid = rets - betas.mul(mret, axis=0)            # MARKET-neutral residual returns

def sector_neutralize(R):
    """Subtract the same-sector cross-sectional mean residual each day (sector-neutral)."""
    out = R.copy()
    for sct, members in SECTORS.items():
        cols = [c for c in members if c in R.columns]
        if len(cols) > 1:
            out[cols] = R[cols].sub(R[cols].mean(axis=1), axis=0)
    return out

residSN = sector_neutralize(resid)                # MARKET + SECTOR-neutral residual returns

# how much daily variance does each factor strip out, name by name?
def share_removed(name):
    raw = rets[name].var()
    return pd.Series({'market only': 1 - resid[name].var()/raw,
                      'market+sector': 1 - residSN[name].var()/raw})
share = pd.DataFrame({n: share_removed(n) for n in names}).T.dropna()
order = share['market+sector'].sort_values().index

fig, ax = plt.subplots(figsize=(11, 9))
ax.barh(order, share.loc[order, 'market+sector'], color=C['purple'], label='market + sector removed')
ax.barh(order, share.loc[order, 'market only'],  color=C['blue'],   label='market only removed')
ax.set_title('Fraction of each stock\'s daily variance explained by market (+ sector)')
ax.set_xlabel('share of variance removed'); ax.legend(loc='lower right')
plt.tight_layout(); plt.show()
print(f'median variance removed -- market only: {share["market only"].median()*100:.0f}%   '
      f'market+sector: {share["market+sector"].median()*100:.0f}%')
print('Most of a stock\'s daily move is market+sector. The residual book bets only on the rest.')
