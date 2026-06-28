nrets = np.log(nifty).reindex(px.index).diff()

def beta_to_mkt(sym):
    d = pd.concat([rets[sym], nrets], axis=1).dropna(); d.columns = ['s', 'm']
    return sm.OLS(d['s'], sm.add_constant(d['m'])).fit().params['m']

bA, bB = beta_to_mkt(A), beta_to_mkt(B)
h = bA / bB                       # beta-neutral short size on leg B per 1 unit long A
net_dollar = bA - 1.0 * bB        # dollar-neutral (+1 A, -1 B): residual beta
net_beta   = bA - h   * bB        # beta-neutral (+1 A, -h B): ~0 by construction

print(f'market beta of {A:>10}: {bA:.2f}')
print(f'market beta of {B:>10}: {bB:.2f}')
print(f'beta-neutral short size on {B}: {h:.2f}x the long notional')
print(f'net beta  --  dollar-neutral (+1/-1): {net_dollar:+.2f}')
print(f'net beta  --  beta-neutral  (+1/-{h:.2f}): {net_beta:+.2f}')

fig, ax = plt.subplots(figsize=(7.5, 4))
labels = ['Dollar-neutral\n(+1 / -1)', f'Beta-neutral\n(+1 / -{h:.2f})']
sns.barplot(x=labels, y=[net_dollar, net_beta], palette=[C['amber'], C['purple']], ax=ax)
ax.axhline(0, color='w', lw=1)
ax.set_ylabel('residual net market beta'); ax.set_title('Same pair, two neutralities: dollar-neutral still carries index risk')
for i, v in enumerate([net_dollar, net_beta]):
    ax.text(i, v, f'{v:+.2f}', ha='center', va='bottom' if v >= 0 else 'top', color='w', fontweight='bold')
plt.tight_layout(); plt.show()
