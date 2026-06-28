bn = backtest(beta, fill='next')      # realistic: signal at close, fill next bar
bs = backtest(beta, fill='same')      # cheat: assume you trade at the very close that made the signal
pn, ps = perf(bn['net'].loc[fullS]), perf(bs['net'].loc[fullS])
en, es = eqc(bn['net'].loc[fullS]), eqc(bs['net'].loc[fullS])

fig, ax = plt.subplots(figsize=(12, 5.2))
ax.plot(en.index, en.values, color=C['blue'], lw=2.0, label=f'NEXT-bar fill (honest)   Sharpe {pn["sharpe"]:.2f}   {pn["total"]*100:+.0f}%')
ax.plot(es.index, es.values, color=C['red'],  lw=2.0, label=f'SAME-bar fill (look-ahead)   Sharpe {ps["sharpe"]:.2f}   {ps["total"]*100:+.0f}%')
ax.axhline(1, color=C['grey'], lw=0.8, ls=':')
ax.set_title('Teardown 4a -- one line of code (shift the fill by a day) swings the whole result')
ax.set_ylabel('growth of Rs 1'); ax.legend(loc='upper left', fontsize=10)
plt.tight_layout(); plt.show()

print(f'same-bar net {ps["total"]*100:+.0f}% (Sharpe {ps["sharpe"]:.2f})   vs   next-bar net {pn["total"]*100:+.0f}% (Sharpe {pn["sharpe"]:.2f})')
print('Note the direction: for a MEAN-REVERSION entry, the same-bar "cheat" is actually WORSE, because it')
print('books the very move that triggered the entry against you. The lesson is not "look-ahead always flatters";')
print('it is that the fill assumption DOMINATES the P&L -- get it wrong either way and the backtest is fiction.')
