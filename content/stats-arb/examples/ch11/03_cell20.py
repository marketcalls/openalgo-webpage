fig, axes = plt.subplots(1, 2, figsize=(13, 5.0), sharey=True)
for ax, (name, bt, col) in zip(axes, [('static beta', bt_static, C['amber']),
                                      ('Kalman beta', bt_kal, C['teal'])]):
    g = bt['gross'].cumsum(); n = bt['net'].cumsum()
    ax.plot(g.index, g.values, color=col, lw=1.8, label='gross')
    ax.plot(n.index, n.values, color=col, lw=1.6, ls='--', alpha=0.8, label='net of costs')
    ax.axhline(0, color=C['grey'], lw=0.8, ls=':')
    ax.axvspan(pd.Timestamp(OOS0), pd.Timestamp(OOS1), color=C['blue'], alpha=0.08, label='out-of-sample')
    shN_is,  _, _ = perf(bt['net'], IS0, IS1)
    shN_oos, _, _ = perf(bt['net'], OOS0, OOS1)
    ax.set_title(f'{name}\nnet Sharpe  IS {shN_is:+.2f}   OOS {shN_oos:+.2f}', fontsize=12)
    ax.set_ylabel('cumulative log return'); ax.legend(fontsize=9, loc='upper left')
fig.suptitle('Static vs Kalman: gross vs net, in-sample vs out-of-sample', fontweight='bold', y=1.02)
plt.tight_layout(); plt.show()
