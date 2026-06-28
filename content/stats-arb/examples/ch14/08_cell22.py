rnif = nifty.pct_change()
def mkt_beta(rs):
    x = pd.concat([rs, rnif], axis=1).loc[TR0:TR1].dropna()
    return np.cov(x.iloc[:,0], x.iloc[:,1])[0,1] / np.var(x.iloc[:,1])

legbeta = {}
for k in BOOK:
    legbeta[allp[k]['a']] = mkt_beta(px[allp[k]['a']].pct_change())
    legbeta[allp[k]['b']] = mkt_beta(px[allp[k]['b']].pct_change())
# market beta of one long-spread unit = beta_A - hedge_ratio * beta_B
pair_mbeta = {k: legbeta[allp[k]['a']] - beta[k]*legbeta[allp[k]['b']] for k in BOOK}

# time-varying book beta (sum over active pairs), and the NIFTY overlay that neutralizes it
book_beta   = sum(exposure[k] * Hd[k] * pair_mbeta[k] for k in BOOK)
book_hedged = book_net + (-book_beta.shift(1).fillna(0.0)) * rnif     # short the residual beta in NIFTY
def roll_beta(r, w=120):
    d = pd.concat([r, rnif], axis=1).dropna()
    return (d.iloc[:,0].rolling(w).cov(d.iloc[:,1]) / d.iloc[:,1].rolling(w).var())
rb_before, rb_after = roll_beta(book_net), roll_beta(book_hedged)

fig, axes = plt.subplots(1, 2, figsize=(13.5, 5.0), gridspec_kw=dict(width_ratios=[2,3]))
ax = axes[0]
mb = pd.Series(pair_mbeta).reindex(BOOK)
sns.barplot(x=mb.values, y=mb.index, hue=mb.index, palette='vlag', legend=False, ax=ax)
ax.axvline(0, color=C['grey'], lw=1.0)
ax.set_title('Market beta of each 1-unit pair\n(rupee-neutral does NOT mean beta-neutral)')
ax.set_xlabel('beta to NIFTY'); ax.set_ylabel('')
ax = axes[1]
ax.plot(rb_before.index, rb_before.values, color=C['red'],  lw=1.4, label=f'book beta, unhedged (mean {rb_before.mean():+.2f})')
ax.plot(rb_after.index,  rb_after.values,  color=C['green'], lw=1.4, label=f'book beta, NIFTY-overlay hedged (mean {rb_after.mean():+.2f})')
ax.axhline(0, color=C['grey'], ls='--', lw=0.9)
ax.set_title('Realized rolling 120-day beta of the book to NIFTY')
ax.set_ylabel('rolling beta'); ax.legend(fontsize=9, loc='upper left')
plt.tight_layout(); plt.show()

print('pair market betas:', {k: round(v,2) for k,v in pair_mbeta.items()})
print(f'book beta(t): mean {book_beta.mean():+.3f}  sd {book_beta.std():.3f}  peak |{book_beta.abs().max():.2f}|  '
      f'-> a "market-neutral" book can quietly carry market risk when a high-hedge-ratio pair is on.')
