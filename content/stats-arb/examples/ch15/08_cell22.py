def stat_row(label, entry=ENTRY, ex=EXIT, stop=STOP, w=W, cost=COST_TURN):
    c = components(beta0, entry=entry, ex=ex, stop=stop, w=w, cost=cost)
    pf, po = perf(c['net'].loc[TR0:TR1]), perf(c['net'].loc[OO0:OO1])
    trips = int(c['turn'].sum()/2)
    return dict(setting=label, IS_Sharpe=round(pf['sharpe'], 2), OOS_Sharpe=round(po['sharpe'], 2),
                full_total=f"{perf(c['net'])['total']*100:+.0f}%", OOS_maxDD=f"{po['maxdd']*100:.0f}%", trips=trips)

rows, groups = [], []
for e in [1.5, 2.0, 2.5, 3.0]:   rows.append(stat_row(f'entry={e}', entry=e));        groups.append(('entry', e, 'OOS_Sharpe'))
for x in [-0.5, 0.0, 0.5, 1.0]:  rows.append(stat_row(f'exit={x}', ex=x))
for st in [3.0, 4.0, 5.0]:       rows.append(stat_row(f'stop={st}', stop=st))
for w in [20, 40, 60, 90, 120]:  rows.append(stat_row(f'window={w}', w=w))
for cm in [0.5, 1.0, 1.5, 2.0]:  rows.append(stat_row(f'cost x{cm}', cost=COST_TURN*cm))
sens = pd.DataFrame(rows).set_index('setting')
print(sens.to_string())

# tornado: OOS Sharpe range per parameter family
fams = {'entry': [1.5,2.0,2.5,3.0], 'exit':[-0.5,0.0,0.5,1.0], 'stop':[3.0,4.0,5.0],
        'window':[20,40,60,90,120], 'cost x':[0.5,1.0,1.5,2.0]}
spans = {}
for fam in fams:
    sub = sens[[fam in i for i in sens.index]]['OOS_Sharpe']
    spans[fam] = (sub.min(), sub.max())
fig, ax = plt.subplots(figsize=(11, 3.8))
order = sorted(spans, key=lambda k: spans[k][1]-spans[k][0])
for i, fam in enumerate(order):
    lo, hi = spans[fam]
    ax.plot([lo, hi], [i, i], color=C['blue'], lw=8, solid_capstyle='round', alpha=0.7)
    ax.text(lo-0.02, i, f'{lo:.2f}', ha='right', va='center', fontsize=9)
    ax.text(hi+0.02, i, f'{hi:.2f}', ha='left', va='center', fontsize=9)
ax.axvline(sharpe(r_oos), color=C['green'], ls='--', lw=1.4, label=f'base OOS Sharpe {sharpe(r_oos):.2f}')
ax.axvline(0, color=C['red'], ls=':', lw=1.2)
ax.set_yticks(range(len(order))); ax.set_yticklabels(order)
ax.set_xlabel('out-of-sample Sharpe range as the knob varies'); ax.set_title('Sensitivity tornado: which knob moves the OOS Sharpe most')
ax.legend(fontsize=9, loc='lower right')
plt.tight_layout(); plt.show()
print('several knobs push the OOS Sharpe across zero -- the result is contingent on choices, not robust to them.')
