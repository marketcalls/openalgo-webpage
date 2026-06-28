# sweep delta at fixed R; report IS and OOS net Sharpe, with the static result as the bar to beat
deltas = np.array([1e-6, 3e-6, 1e-5, 3e-5, 1e-4, 3e-4, 1e-3, 3e-3])
sweep = []
for d in deltas:
    kfd = kalman_hedge(A, B, delta=d, R=ROBS)
    spd = kfd['spread'].copy(); spd.iloc[:60] = np.nan
    btd = backtest(zscore(spd), kfd['beta'])
    sweep.append((d, perf(btd['net'], IS0, IS1)[0], perf(btd['net'], OOS0, OOS1)[0]))
sweep = pd.DataFrame(sweep, columns=['delta', 'IS_net_sharpe', 'OOS_net_sharpe'])

stat_is  = perf(bt_static['net'], IS0, IS1)[0]
stat_oos = perf(bt_static['net'], OOS0, OOS1)[0]

fig, ax = plt.subplots(figsize=(11, 4.8))
ax.plot(sweep['delta'], sweep['IS_net_sharpe'],  'o-', color=C['purple'], lw=1.8, label='Kalman IS net Sharpe')
ax.plot(sweep['delta'], sweep['OOS_net_sharpe'], 'o-', color=C['teal'],   lw=1.8, label='Kalman OOS net Sharpe')
ax.axhline(stat_is,  color=C['amber'], ls='--', lw=1.6, label=f'static IS net = {stat_is:+.2f}')
ax.axhline(stat_oos, color=C['red'],   ls='--', lw=1.6, label=f'static OOS net = {stat_oos:+.2f}')
ax.axhline(0, color=C['grey'], lw=0.8, ls=':')
ax.set_xscale('log'); ax.set_xlabel('delta  (process noise; bigger = faster-moving beta)')
ax.set_ylabel('annualised net Sharpe')
ax.set_title('Sensitivity to the process-noise knob: the Kalman result is a function of delta')
ax.legend(fontsize=8.5, ncol=2, loc='lower left')
plt.tight_layout(); plt.show()
disp = sweep.copy()
disp['delta'] = disp['delta'].map(lambda d: f'{d:.0e}')
disp['IS_net_sharpe'] = disp['IS_net_sharpe'].round(2)
disp['OOS_net_sharpe'] = disp['OOS_net_sharpe'].round(2)
print('Kalman net Sharpe by delta:'); print(disp.to_string(index=False))
print(f'\nNote: as delta -> 0 the Kalman freezes into the static beta and recovers toward it;')
print(f'as delta grows it chases noise and decays. No setting clears the static OOS bar of {stat_oos:+.2f}.')
