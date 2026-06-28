eqn = (1 + book_net).cumprod(); ddn = eqn/eqn.cummax() - 1     # the book's own drawdown path

throttle, state = [], 1.0
for d in ddn.values:                                            # de-risk to 0.5 below -5% dd, restore above -2%
    if   state == 1.0 and d < -0.05: state = 0.5
    elif state == 0.5 and d > -0.02: state = 1.0
    throttle.append(state)
throttle = pd.Series(throttle, index=ddn.index).shift(1).fillna(1.0)   # act on YESTERDAY's drawdown (causal)
book_dd  = book_net * throttle

eb, ed = eqc(book_net.loc[TR0:OO1]), eqc(book_dd.loc[TR0:OO1])
ddb = eb/eb.cummax() - 1; ddd = ed/ed.cummax() - 1
pb, pd_ = perf(book_net.loc[TR0:OO1]), perf(book_dd.loc[TR0:OO1])

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12.5, 7.2), sharex=True, gridspec_kw=dict(height_ratios=[2,1]))
ax1.plot(eb.index, eb.values, color=C['grey'],  lw=1.6, label=f"static  Sharpe {pb['sharpe']:.2f}  maxDD {pb['maxdd']*100:.0f}%")
ax1.plot(ed.index, ed.values, color=C['green'], lw=1.9, label=f"drawdown-throttled  Sharpe {pd_['sharpe']:.2f}  maxDD {pd_['maxdd']*100:.0f}%")
ax1.axhline(1, color=C['grey'], ls=':', lw=0.8); ax1.axvline(pd.Timestamp(OO0), color=C['grey'], ls='--', lw=1.0)
ax1.set_title('Drawdown control: cut exposure to half once the book is 5% below its high'); ax1.set_ylabel('growth of Rs 1'); ax1.legend(fontsize=9, loc='upper left')
ax2.fill_between(ddb.index, ddb.values*100, 0, color=C['grey'],  alpha=0.45, label='static')
ax2.fill_between(ddd.index, ddd.values*100, 0, color=C['green'], alpha=0.40, label='throttled')
ax2.set_ylabel('drawdown %'); ax2.set_xlabel(''); ax2.legend(fontsize=9, loc='lower left')
plt.tight_layout(); plt.show()

print(f"static            : Sharpe {pb['sharpe']:.2f}  vol {pb['vol']*100:.1f}%  maxDD {pb['maxdd']*100:.1f}%  total {pb['total']*100:+.0f}%")
print(f"drawdown-throttled: Sharpe {pd_['sharpe']:.2f}  vol {pd_['vol']*100:.1f}%  maxDD {pd_['maxdd']*100:.1f}%  total {pd_['total']*100:+.0f}%")
print('the tail shrinks, but so does the return -- drawdown control is a deliberate trade, not a free upgrade.')
