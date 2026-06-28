import statsmodels.api as sm
demo = 'AXISBANK'
d = pd.DataFrame({'mkt': mret, 'stk': rets[demo]}).dropna()
ols = sm.OLS(d['stk'], sm.add_constant(d['mkt'])).fit()
b_full, r2 = ols.params['mkt'], ols.rsquared
d['resid'] = ols.resid

fig, (axL, axR) = plt.subplots(1, 2, figsize=(13, 5))
sns.regplot(data=d, x='mkt', y='stk', ax=axL, scatter_kws=dict(s=8, alpha=0.25, color=C['blue']),
            line_kws=dict(color=C['amber'], lw=2.2))
axL.set_title(f'{demo} daily return vs NIFTY  (beta={b_full:.2f}, R^2={r2:.2f})')
axL.set_xlabel('NIFTY daily log return'); axL.set_ylabel(f'{demo} daily log return')
axL.axhline(0, color=C['grey'], lw=.6); axL.axvline(0, color=C['grey'], lw=.6)

sns.histplot(d['resid'], bins=80, color=C['green'], ax=axR, stat='density')
axR.set_title(f'{demo} RESIDUAL (return minus beta . NIFTY)')
axR.set_xlabel('residual daily return'); axR.axvline(0, color=C['red'], ls='--', lw=1.2)
plt.tight_layout(); plt.show()

print(f'{demo}: market explains R^2={r2*100:.0f}% of its daily variance; '
      f'the residual std is {d["resid"].std()*100:.2f}% vs raw {d["stk"].std()*100:.2f}% per day.')
print('A single-stock position is mostly a market position. The residual is the small part we can isolate.')
