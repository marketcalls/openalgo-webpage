# The chart you are not allowed to hide: the honest, net, out-of-sample equity curve.
no  = eqc(bt['net'].loc[ooS]); p = perf(bt['net'].loc[ooS])
dd  = no/no.cummax() - 1
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 6.6), sharex=True,
                               gridspec_kw=dict(height_ratios=[3, 1]))
ax1.plot(no.index, no.values, color=C['red'], lw=2.2)
ax1.axhline(1, color=C['grey'], lw=1.0, ls='--')
ax1.fill_between(no.index, 1, no.values, where=(no.values>=1), color=C['green'], alpha=0.10)
ax1.fill_between(no.index, 1, no.values, where=(no.values< 1), color=C['red'],   alpha=0.10)
ax1.set_ylabel('growth of Rs 1')
ax1.set_title(f'The honest bottom line: NET, OUT-OF-SAMPLE equity  ({A_name}/{B_name})\n'
              f'Sharpe {p["sharpe"]:.2f}   total {p["total"]*100:+.1f}%   max drawdown {p["maxdd"]*100:.1f}%')
ax2.fill_between(dd.index, dd.values*100, 0, color=C['red'], alpha=0.35)
ax2.set_ylabel('drawdown (%)'); ax2.set_xlabel('')
plt.tight_layout(); plt.show()

print(f'Net of realistic NSE costs, out of sample, over {(pd.Timestamp(OO1)-pd.Timestamp(OO0)).days/365.25:.1f} years,')
print(f'this much-celebrated pair returned {p["total"]*100:+.1f}% at a Sharpe of {p["sharpe"]:.2f} -- before a single')
print(f'rupee of borrow cost, financing, slippage beyond our estimate, or the equity-short problem. That is the truth.')
