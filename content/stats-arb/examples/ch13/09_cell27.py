b0, _ = backtest(residSN, K, 0.0)            # gross once; cost is linear in cost_side
gross_mu, turn_mu = b0['gross'].mean(), b0['turn'].mean()
breakeven_bps = gross_mu / turn_mu * 1e4
cps = np.linspace(0, 14, 80)                 # per-side cost in bps
net_ann = (gross_mu - (cps/1e4) * turn_mu) * 252 * 100   # annualised net return, %

fig, ax = plt.subplots(figsize=(11.5, 5.2))
ax.plot(cps, net_ann, color=C['purple'], lw=2.4)
ax.axhline(0, color=C['grey'], lw=1.0)
ax.fill_between(cps, net_ann, 0, where=(net_ann > 0), color=C['green'], alpha=.18)
ax.fill_between(cps, net_ann, 0, where=(net_ann < 0), color=C['red'],   alpha=.15)
ax.axvline(breakeven_bps, color=C['grey'], ls=':', lw=1.4)
ax.text(breakeven_bps, ax.get_ylim()[1]*0.9, f'  breakeven {breakeven_bps:.1f} bps/side', fontsize=10)
for x, lab, col in [(equity_cost_bps('MIS'), 'MIS (intraday)', C['amber']),
                    (equity_cost_bps('CNC'), 'CNC (overnight)', C['red'])]:
    ax.axvline(x, color=col, ls='--', lw=1.6)
    ax.text(x, ax.get_ylim()[0]*0.8, f' {lab}\n {x:.1f} bps', color=col, fontsize=9, va='bottom')
ax.set_title(f'Net annualised return vs per-side cost (k={K}) -- realistic costs sit far past breakeven')
ax.set_xlabel('assumed per-side cost (bps of traded value)'); ax.set_ylabel('net annualised return (%)')
plt.tight_layout(); plt.show()
print(f'breakeven per-side cost = {breakeven_bps:.2f} bps; realistic MIS = {equity_cost_bps("MIS"):.1f} bps, '
      f'CNC = {equity_cost_bps("CNC"):.1f} bps.')
print('You would need to trade at a fraction of realistic NSE cost for this to make money. That is the verdict.')
