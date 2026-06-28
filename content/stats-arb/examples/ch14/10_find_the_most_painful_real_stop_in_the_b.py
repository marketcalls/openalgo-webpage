# find the most painful REAL stop in the book (excluding the COVID crash, a genuine break),
# where the stop fired and the spread then reverted hard -- the dilemma made concrete.
COVID = (pd.Timestamp('2020-02-15'), pd.Timestamp('2020-05-31'))
best = None
for k in BOOK:
    z, unit = allp[k]['z'], allp[k]['unit']; held = positions(z)
    for i in range(1, len(z)-1):
        if held.iloc[i] == 0 and held.iloc[i-1] != 0 and abs(z.iloc[i]) > STOP:
            if COVID[0] <= z.index[i] <= COVID[1]: continue
            j = i-1
            while j > 0 and held.iloc[j-1] == held.iloc[i-1]: j -= 1
            dirn = held.iloc[i-1]
            kk = i
            while kk < len(z)-1 and abs(z.iloc[kk]) > EXIT and kk-i < 60: kk += 1
            pnl_stop = float((dirn*unit.iloc[j+1:i+1]).sum())
            pnl_hold = float((dirn*unit.iloc[j+1:kk+1]).sum())
            if kk-i >= 3 and (best is None or pnl_hold-pnl_stop > best['regret']):
                best = dict(pair=k, e=z.index[j], s=z.index[i], r=z.index[kk],
                            pnl_stop=pnl_stop, pnl_hold=pnl_hold, regret=pnl_hold-pnl_stop, dirn=int(dirn))

k = best['pair']; z = allp[k]['z']; sp = (np.log(px[allp[k]['a']]) - beta[k]*np.log(px[allp[k]['b']]))
lo, hi = best['e'] - pd.Timedelta(days=20), best['r'] + pd.Timedelta(days=20)
zw = z.loc[lo:hi]
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12.5, 7.0), sharex=True, gridspec_kw=dict(height_ratios=[1,1.2]))
ax1.plot(sp.loc[lo:hi].index, sp.loc[lo:hi].values, color=C['purple'], lw=1.5)
ax1.set_title(f"Stop-loss dilemma on {k}: spread (log)"); ax1.set_ylabel('spread')
for d, c, lab in [(best['e'], C['amber'], 'entry'), (best['s'], C['red'], 'STOP fires'), (best['r'], C['green'], 'reverts to mean')]:
    ax1.axvline(d, color=c, ls='--', lw=1.4); ax1.text(d, sp.loc[lo:hi].max(), '  '+lab, color=c, fontsize=9, va='top')
ax2.plot(zw.index, zw.values, color=C['blue'], lw=1.5)
ax2.axhline(STOP*np.sign(best['dirn']*-1), color=C['red'], ls='--', lw=1.2, label=f'stop (|z|={STOP})')
ax2.axhline(0, color=C['grey'], ls='--', lw=0.8); ax2.axhline(-EXIT*np.sign(best['dirn']*-1), color=C['green'], ls=':', lw=1.0, label='exit band')
for d, c in [(best['e'], C['amber']), (best['s'], C['red']), (best['r'], C['green'])]:
    ax2.axvline(d, color=c, ls='--', lw=1.4)
ax2.set_title('z-score: the stop fired at the extreme, then the spread came home'); ax2.set_ylabel('z'); ax2.legend(fontsize=9, loc='upper right')
plt.tight_layout(); plt.show()

print(f"trade: {k}, {('short' if best['dirn']<0 else 'long')} the spread, entered {best['e'].date()}")
print(f"  STOPPED OUT on {best['s'].date()} for {best['pnl_stop']*100:+.1f}%  (1-unit spread P&L)")
print(f"  had we HELD to the reversion on {best['r'].date()}: {best['pnl_hold']*100:+.1f}%")
print(f"  the stop cost {best['regret']*100:.1f}% of missed reversion -- and yet, on a pair that truly breaks,")
print(f"  that same stop is the only thing standing between you and an unbounded loss. That is the dilemma.")
