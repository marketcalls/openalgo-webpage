g_f, n_f = perf(bt['gross'].loc[fullS]), perf(bt['net'].loc[fullS])
gf, nf = eqc(bt['gross'].loc[fullS]), eqc(bt['net'].loc[fullS])
cost_paid = (bt['turn'].loc[fullS] * COST_TURN).sum()      # total fraction lost to costs

fig, ax = plt.subplots(figsize=(12, 5.2))
ax.plot(gf.index, gf.values, color=C['green'], lw=2.0, label=f'GROSS   Sharpe {g_f["sharpe"]:.2f}   +{g_f["total"]*100:.0f}%')
ax.plot(nf.index, nf.values, color=C['blue'],  lw=2.0, label=f'NET of NSE costs   Sharpe {n_f["sharpe"]:.2f}   +{n_f["total"]*100:.0f}%')
ax.fill_between(gf.index, nf.values, gf.values, color=C['red'], alpha=0.12, label='eaten by costs')
ax.axhline(1, color=C['grey'], lw=0.8, ls=':')
ax.set_title('Teardown 2 -- the same strategy, gross vs net of realistic NSE costs (full sample)')
ax.set_ylabel('growth of Rs 1'); ax.legend(loc='upper left', fontsize=10)
plt.tight_layout(); plt.show()

print(f'full sample: {trips(bt, fullS)} round trips x {COST_RT*100:.3f}% = {cost_paid*100:.1f}% of capital paid as costs')
print(f'Sharpe  gross {g_f["sharpe"]:.2f}  ->  net {n_f["sharpe"]:.2f}     '
      f'total return  +{g_f["total"]*100:.0f}%  ->  +{n_f["total"]*100:.0f}%')
print(f'in this window costs are a haircut, not a guillotine -- because +/-2 sd trades rarely. But that')
print(f'depends entirely on the cost you ASSUME. The next chart sweeps it.')
