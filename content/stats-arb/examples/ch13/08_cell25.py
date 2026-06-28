ks = [1, 2, 3, 5, 7, 10, 15, 20]
res = []
for k in ks:
    b, _ = backtest(residSN, k, COST_MIS)
    res.append(dict(k=k, gross=perf(b['gross'])['sharpe'], net=perf(b['net'])['sharpe'],
                    turn=b['turn'].mean()))
R = pd.DataFrame(res).set_index('k')

fig, ax = plt.subplots(figsize=(11.5, 5.2))
ax.plot(R.index, R['gross'], 'o-', color=C['green'], lw=2, label='gross Sharpe')
ax.plot(R.index, R['net'],   'o-', color=C['red'],   lw=2, label='net Sharpe (MIS)')
ax.axhline(0, color=C['grey'], lw=1.0, ls='--')
ax.set_xlabel('holding / lookback k (days)'); ax.set_ylabel('annualised Sharpe')
ax.set_title('Gross vs net Sharpe vs k -- trading slower shrinks the loss but never closes it')
ax.legend(loc='center right')
ax2 = ax.twinx()
ax2.plot(R.index, R['turn'], 's--', color=C['blue'], lw=1.4, alpha=.7, label='turnover/day')
ax2.set_ylabel('one-way turnover / day', color=C['blue']); ax2.grid(False)
plt.tight_layout(); plt.show()
print(R.round(2).to_string())
print('Slower trading helps via turnover, not via a better signal. The edge cannot out-run the toll.')
