import itertools
bankpx = closes(SECTORS['Banks'], start='2017-01-01', end='2026-06-26').dropna()

def pair_net_sharpes(Pa, Pb):
    laa, lbb = np.log(Pa), np.log(Pb)
    bb = np.polyfit(lbb.loc[TR0:TR1].values, laa.loc[TR0:TR1].values, 1)[0]
    s  = laa - bb * lbb
    held = positions(zscore(s)).shift(1)
    net  = held * (Pa.pct_change() - bb * Pb.pct_change()) - COST_TURN * held.diff().abs().fillna(0)
    return perf(net.loc[isS])['sharpe'], perf(net.loc[ooS])['sharpe']

rows = []
for a, b in itertools.combinations(SECTORS['Banks'], 2):
    si, so = pair_net_sharpes(bankpx[a], bankpx[b])
    rows.append((f'{a}/{b}', si, so))
sc = pd.DataFrame(rows, columns=['pair', 'IS_net_Sharpe', 'OOS_net_Sharpe']).sort_values('OOS_net_Sharpe')

fig, ax = plt.subplots(figsize=(12, 6.0))
yp = np.arange(len(sc))
ax.barh(yp - 0.2, sc['IS_net_Sharpe'],  height=0.4, color=C['blue'], label='in-sample net Sharpe')
ax.barh(yp + 0.2, sc['OOS_net_Sharpe'], height=0.4, color=C['red'],  label='out-of-sample net Sharpe')
ax.set_yticks(yp); ax.set_yticklabels(sc['pair'])
ax.axvline(0, color=C['grey'], lw=1.0)
for i, pr in enumerate(sc['pair']):
    if pr == f'{A_name}/{B_name}':
        ax.axhspan(i-0.45, i+0.45, color=C['amber'], alpha=0.12)
ax.set_xlabel('net Sharpe'); ax.set_title('Teardown 4c -- survivorship: we picked the IN-SAMPLE winner of 10 bank pairs')
ax.legend(fontsize=9, loc='lower right')
plt.tight_layout(); plt.show()

our = sc[sc['pair'] == f'{A_name}/{B_name}'].iloc[0]
print(f'{A_name}/{B_name}:  IS net Sharpe {our["IS_net_Sharpe"]:.2f} (rank '
      f'{int((sc["IS_net_Sharpe"]>our["IS_net_Sharpe"]).sum())+1} of {len(sc)} in-sample)  '
      f'->  OOS net Sharpe {our["OOS_net_Sharpe"]:.2f}')
print(f'{(sc["OOS_net_Sharpe"]<0).sum()} of {len(sc)} bank pairs actually LOSE money net out-of-sample.')
print('We did not find a good pair; we ran a beauty contest in-sample and crowned a winner. Out of sample,')
print('the crown is worth little -- and the pairs that broke (and the names that delisted entirely) are invisible here.')
