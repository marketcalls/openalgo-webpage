bt_cnc, _ = backtest(residSN, K, COST_CNC)
gE, nM, nC = eqc(bt['gross']), eqc(bt['net']), eqc(bt_cnc['net'])
pM, pC = perf(bt['net']), perf(bt_cnc['net'])

fig, ax = plt.subplots(figsize=(12, 5.6))
ax.plot(gE.index, gE.values, color=C['green'], lw=2.2,
        label=f'GROSS              Sharpe {g["sharpe"]:.2f}   {g["total"]*100:+.0f}%')
ax.plot(nM.index, nM.values, color=C['amber'], lw=2.0,
        label=f'NET (MIS, intraday)  Sharpe {pM["sharpe"]:.2f}   {pM["total"]*100:+.0f}%')
ax.plot(nC.index, nC.values, color=C['red'],   lw=2.0,
        label=f'NET (CNC, overnight) Sharpe {pC["sharpe"]:.2f}   {pC["total"]*100:+.0f}%')
ax.axhline(1, color=C['grey'], lw=.8, ls=':')
ax.set_title(f'Cross-sectional residual reversion (k={K}): gross is real, net is the problem')
ax.set_ylabel('growth of Rs 1 (gross book = 1)'); ax.legend(loc='upper left', fontsize=10)
plt.tight_layout(); plt.show()
print('Same signal, same days. The only thing that changed is whether we paid to trade it.')
