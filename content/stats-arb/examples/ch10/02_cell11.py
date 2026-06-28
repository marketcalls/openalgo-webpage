g_oos, n_oos = perf(bt['gross'].loc[ooS]), perf(bt['net'].loc[ooS])
ni, no = eqc(bt['net'].loc[isS]), eqc(bt['net'].loc[ooS])

fig, ax = plt.subplots(figsize=(12, 5.2))
ax.plot(ni.index, ni.values, color=C['blue'], lw=2.0,
        label=f'IN-SAMPLE net   Sharpe {n_is["sharpe"]:.2f}   {n_is["total"]*100:+.0f}%')
ax.plot(no.index, no.values, color=C['red'], lw=2.0,
        label=f'OUT-OF-SAMPLE net   Sharpe {n_oos["sharpe"]:.2f}   {n_oos["total"]*100:+.0f}%')
ax.axvline(pd.Timestamp(OO0), color=C['grey'], ls='--', lw=1.2)
ax.text(pd.Timestamp(OO0), ax.get_ylim()[1]*0.98, '  frozen rule applied blind ->',
        color=C['grey'], fontsize=10, va='top')
ax.axhline(1, color=C['grey'], lw=0.8, ls=':')
ax.set_title('Teardown 1 -- fit on TRAIN, freeze, apply UNCHANGED to the held-out TEST')
ax.set_ylabel('growth of Rs 1 (each leg rebased)'); ax.legend(loc='upper left', fontsize=10)
plt.tight_layout(); plt.show()

drop = (1 - n_oos["sharpe"]/n_is["sharpe"]) * 100
print(f'in-sample  net Sharpe {n_is["sharpe"]:.2f}  ->  out-of-sample net Sharpe {n_oos["sharpe"]:.2f}   '
      f'({drop:.0f}% of the edge gone)')
print(f'out-of-sample: {trips(bt, ooS)} round trips, net total {n_oos["total"]*100:+.1f}% over '
      f'{(pd.Timestamp(OO1)-pd.Timestamp(OO0)).days/365.25:.1f} years, max drawdown {n_oos["maxdd"]*100:.1f}%')
