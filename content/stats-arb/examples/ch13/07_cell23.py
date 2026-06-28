rows = []
for tag, R in [('market only', resid), ('market + sector', residSN)]:
    b, _ = backtest(R, K, COST_MIS)
    rows.append(dict(model=tag, gross=perf(b['gross'])['sharpe'], net=perf(b['net'])['sharpe']))
comp = pd.DataFrame(rows).set_index('model')

fig, ax = plt.subplots(figsize=(9, 4.8))
comp.plot(kind='bar', ax=ax, color=[C['green'], C['red']], width=0.7, edgecolor='none')
ax.axhline(0, color=C['grey'], lw=1.0)
ax.set_title(f'Sharpe by factor model (k={K}): removing sector lifts GROSS, net stays under water')
ax.set_ylabel('annualised Sharpe'); ax.set_xlabel(''); ax.legend(['gross', 'net (MIS)'])
ax.tick_params(axis='x', rotation=0)
for c in ax.containers: ax.bar_label(c, fmt='%.2f', fontsize=9, padding=2)
plt.tight_layout(); plt.show()
print(comp.round(2).to_string())
