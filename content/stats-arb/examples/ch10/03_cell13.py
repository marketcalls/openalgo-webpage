def walk_forward(refit=63, lookback=504, cost=COST_TURN):
    """Re-fit the hedge ratio every `refit` days on a trailing `lookback` window, then trade
    the NEXT block forward with that frozen b and the rolling z-score. Pure out-of-sample."""
    idx, pieces, betas = A.index, [], {}
    i = lookback
    while i < len(idx):
        j  = min(i + refit, len(idx))
        tr = slice(idx[i-lookback], idx[i-1])
        bb = np.polyfit(lb.loc[tr].values, la.loc[tr].values, 1)[0]
        s  = la - bb * lb
        held = positions(zscore(s)).shift(1)
        sr   = A.pct_change() - bb * B.pct_change()
        net  = held * sr - cost * held.diff().abs().fillna(0)
        seg  = slice(idx[i], idx[j-1])
        pieces.append(net.loc[seg]); betas[idx[i]] = bb
        i = j
    return pd.concat(pieces), pd.Series(betas)

wf, wf_beta = walk_forward()
p_wf  = perf(wf)
p_pre = perf(wf.loc[:'2023-12-31'])
p_pst = perf(wf.loc['2024-01-01':])

fig, ax = plt.subplots(figsize=(12, 5.0))
w_eq = eqc(wf)
ax.plot(w_eq.index, w_eq.values, color=C['teal'], lw=2.0,
        label=f'rolling walk-forward net   Sharpe {p_wf["sharpe"]:.2f}   {p_wf["total"]*100:+.0f}%')
ax.axvline(pd.Timestamp(OO0), color=C['grey'], ls='--', lw=1.2)
ax.axhline(1, color=C['grey'], lw=0.8, ls=':')
ax.set_title('Walk-forward: re-fit the hedge ratio every quarter on 2y of trailing data, trade forward')
ax.set_ylabel('growth of Rs 1'); ax.legend(loc='upper left', fontsize=10)
plt.tight_layout(); plt.show()

print(f'walk-forward full      : Sharpe {p_wf["sharpe"]:.2f}   {p_wf["total"]*100:+.1f}%')
print(f'walk-forward pre-2024  : Sharpe {p_pre["sharpe"]:.2f}')
print(f'walk-forward 2024->now : Sharpe {p_pst["sharpe"]:.2f}   {p_pst["total"]*100:+.1f}%  (the only part that is truly recent)')
print(f'refitting the hedge ratio recovers some of the frozen-OOS loss, but it lands far below the')
print(f'in-sample {n_is["sharpe"]:.2f} -- and every refit is another chance to overfit. No free lunch.')
