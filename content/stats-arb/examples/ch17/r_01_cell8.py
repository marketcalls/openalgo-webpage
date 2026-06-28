g_is, n_is = perf(bt['gross'].loc[isS]), perf(bt['net'].loc[isS])

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7.4), sharex=True,
                               gridspec_kw=dict(height_ratios=[2, 1]))
gi, ni = eqc(bt['gross'].loc[isS]), eqc(bt['net'].loc[isS])
ax1.plot(gi.index, gi.values, color=C['green'], lw=2.0, label=f'gross  (Sharpe {g_is["sharpe"]:.2f}, +{g_is["total"]*100:.0f}%)')
ax1.plot(ni.index, ni.values, color=C['blue'],  lw=2.0, label=f'net of costs  (Sharpe {n_is["sharpe"]:.2f}, +{n_is["total"]*100:.0f}%)')
ax1.axhline(1, color=C['grey'], lw=0.8, ls=':')
ax1.set_title(f'Exhibit A -- the seductive IN-SAMPLE curve  ({A_name}/{B_name}, train {TR0[:4]}-{TR1[:4]})')
ax1.set_ylabel('growth of Rs 1'); ax1.legend(loc='upper left', fontsize=10)

zz, held_is = bt['z'].loc[isS], bt['held'].loc[isS]
ax2.plot(zz.index, zz.values, color=C['purple'], lw=0.8)
for k, c in [(ENTRY, C['amber']), (STOP, C['red'])]:
    ax2.axhline(k, color=c, ls=':', lw=1.0); ax2.axhline(-k, color=c, ls=':', lw=1.0)
ax2.axhline(0, color=C['grey'], ls='--', lw=1.0)
ax2.fill_between(zz.index, -STOP, STOP, where=(held_is > 0), color=C['green'], alpha=0.12, label='long spread')
ax2.fill_between(zz.index, -STOP, STOP, where=(held_is < 0), color=C['red'],   alpha=0.12, label='short spread')
ax2.set_ylabel('z-score'); ax2.set_ylim(-STOP-0.5, STOP+0.5)
ax2.set_title('positions (shaded): enter at +/-2 sd, exit at the mean, stop at +/-4 sd')
ax2.legend(loc='upper left', fontsize=8, ncol=2)
plt.tight_layout(); plt.show()

print(f'IN-SAMPLE {TR0}..{TR1}:  gross Sharpe {g_is["sharpe"]:.2f}   net Sharpe {n_is["sharpe"]:.2f}   '
      f'net total {n_is["total"]*100:+.1f}%   max drawdown {n_is["maxdd"]*100:.1f}%   round trips {trips(bt, isS)}')
print('This is the chart that gets a strategy funded. Now we take it apart, one leak at a time.')
