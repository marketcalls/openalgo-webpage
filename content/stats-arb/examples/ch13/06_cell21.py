fig, (axT, axD) = plt.subplots(2, 1, figsize=(12, 7), sharex=True,
                               gridspec_kw=dict(height_ratios=[1, 1]))
roll_turn = bt['turn'].rolling(21).mean()
axT.plot(roll_turn.index, roll_turn.values, color=C['blue'], lw=1.5)
axT.axhline(bt['turn'].mean(), color=C['red'], ls='--', lw=1.2,
            label=f'mean {bt["turn"].mean():.2f}/day')
axT.set_title('One-way turnover (21-day mean) -- close to the whole book, every day')
axT.set_ylabel('turnover / day'); axT.legend(loc='upper right')

daily_edge = bt['gross'].rolling(21).mean() * 1e4
daily_cost = (bt['turn'] * COST_MIS).rolling(21).mean() * 1e4
axD.plot(daily_edge.index, daily_edge.values, color=C['green'], lw=1.6, label='gross edge (bps/day)')
axD.plot(daily_cost.index, daily_cost.values, color=C['amber'], lw=1.6, label='MIS cost drag (bps/day)')
axD.fill_between(daily_edge.index, daily_edge.values, daily_cost.values,
                 where=(daily_cost.values > daily_edge.values), color=C['red'], alpha=0.18)
axD.axhline(0, color=C['grey'], lw=.8)
axD.set_title('Gross edge vs cost drag (21-day mean) -- red = costs exceed the edge')
axD.set_ylabel('bps / day'); axD.legend(loc='upper right'); axD.set_xlabel('')
plt.tight_layout(); plt.show()
print(f'annualised one-way turnover ~ {bt["turn"].mean()*252:.0f}x the gross book.')
print(f'gross ~ {bt["gross"].mean()*1e4:.2f} bps/day vs MIS cost ~ {(bt["turn"]*COST_MIS).mean()*1e4:.2f} bps/day.')
