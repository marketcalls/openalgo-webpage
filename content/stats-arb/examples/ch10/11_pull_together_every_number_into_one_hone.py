# pull together every number into one honest scorecard
def row(label, ret, sl):
    p = perf(ret.loc[sl])
    return dict(view=label, Sharpe=round(p['sharpe'],2), ann_vol=round(p['vol']*100,1),
                total_pct=round(p['total']*100,1), maxDD_pct=round(p['maxdd']*100,1))

card = pd.DataFrame([
    row('IN-SAMPLE  gross',      bt['gross'], isS),
    row('IN-SAMPLE  net',        bt['net'],   isS),
    row('OUT-OF-SAMPLE  gross',  bt['gross'], ooS),
    row('OUT-OF-SAMPLE  net',    bt['net'],   ooS),
    dict(view='WALK-FORWARD 2024+ net', Sharpe=round(perf(wf.loc["2024-01-01":])['sharpe'],2),
         ann_vol=round(perf(wf.loc["2024-01-01":])['vol']*100,1),
         total_pct=round(perf(wf.loc["2024-01-01":])['total']*100,1),
         maxDD_pct=round(perf(wf.loc["2024-01-01":])['maxdd']*100,1)),
]).set_index('view')
print(card.to_string())

# the Sharpe waterfall: where the seductive in-sample number goes
stages = ['IS gross', 'IS net\n(-costs)', 'OOS gross\n(-out of sample)', 'OOS net\n(both)']
vals   = [perf(bt['gross'].loc[isS])['sharpe'], perf(bt['net'].loc[isS])['sharpe'],
          perf(bt['gross'].loc[ooS])['sharpe'], perf(bt['net'].loc[ooS])['sharpe']]
fig, ax = plt.subplots(figsize=(10, 4.8))
cols = [C['green'], C['blue'], C['amber'], C['red']]
bars = ax.bar(stages, vals, color=cols, width=0.6)
for bbar, v in zip(bars, vals):
    ax.text(bbar.get_x()+bbar.get_width()/2, v+0.02, f'{v:.2f}', ha='center', fontsize=11, fontweight='bold')
ax.axhline(0, color=C['grey'], lw=1.0)
ax.set_ylabel('net Sharpe'); ax.set_title('The seductive in-sample Sharpe, deflated one honest step at a time')
plt.tight_layout(); plt.show()
