# A subtler, classic look-ahead: normalise the z-score with WHOLE-SAMPLE mean/std (which "knows"
# the test period's range) instead of a trailing window. This one flatters the held-out test.
z_leak  = (spread - spread.mean()) / spread.std()          # peeks at the future
b_leak  = backtest(beta, z=z_leak)
p_leak  = perf(b_leak['net'].loc[ooS])
p_honest = perf(bt['net'].loc[ooS])
el, eh = eqc(b_leak['net'].loc[ooS]), eqc(bt['net'].loc[ooS])

fig, ax = plt.subplots(figsize=(12, 5.0))
ax.plot(el.index, el.values, color=C['red'],  lw=2.0, label=f'full-sample z (leak)   OOS Sharpe {p_leak["sharpe"]:.2f}   {p_leak["total"]*100:+.0f}%')
ax.plot(eh.index, eh.values, color=C['blue'], lw=2.0, label=f'trailing z (honest)   OOS Sharpe {p_honest["sharpe"]:.2f}   {p_honest["total"]*100:+.0f}%')
ax.axhline(1, color=C['grey'], lw=0.8, ls=':')
ax.set_title('Teardown 4b -- normalising the test set with statistics that include the test set')
ax.set_ylabel('growth of Rs 1 (OOS only)'); ax.legend(loc='upper left', fontsize=10)
plt.tight_layout(); plt.show()

print(f'OOS net Sharpe inflates from {p_honest["sharpe"]:.2f} (trailing, honest) to {p_leak["sharpe"]:.2f} '
      f'(full-sample z) -- a {p_leak["sharpe"]/p_honest["sharpe"]:.1f}x boost from a single subtle leak,')
print('and not a rupee of it is tradeable: you cannot standardise today by a mean you only learn next year.')
