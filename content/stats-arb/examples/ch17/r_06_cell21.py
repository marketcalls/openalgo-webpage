def rolling_coint_p(la, lb, w=252, step=10):
    out = {}
    for i in range(w, len(la), step):
        try: out[la.index[i]] = coint(la.iloc[i-w:i], lb.iloc[i-w:i])[1]
        except Exception: pass
    return pd.Series(out)

rc = rolling_coint_p(la, lb)
fig, ax = plt.subplots(figsize=(12, 5.0))
ax.plot(rc.index, rc.values, color=C['purple'], lw=1.6)
ax.axhline(0.05, color=C['red'], ls='--', lw=1.4, label='5% significance')
ax.fill_between(rc.index, 0, 0.05, color=C['green'], alpha=0.10, label='cointegrated zone (p<0.05)')
ax.axvspan(pd.Timestamp(TR0), pd.Timestamp(TR1), color=C['blue'], alpha=0.06, label='TRAIN')
ax.axvspan(pd.Timestamp(OO0), pd.Timestamp(OO1), color=C['amber'], alpha=0.06, label='TEST')
ax.set_ylabel('Engle-Granger p-value (252d rolling)'); ax.set_ylim(0, 1)
ax.set_title('Teardown 3 -- the pair is only "cointegrated" some of the time')
ax.legend(fontsize=8, ncol=2, loc='upper left')
plt.tight_layout(); plt.show()

frac = (rc > 0.05).mean() * 100
print(f'rolling cointegration p-value: min {rc.min():.3f}  max {rc.max():.3f}  latest {rc.iloc[-1]:.3f}')
print(f'the pair FAILS the 5% cointegration test in {frac:.0f}% of rolling windows -- it is the exception,')
print(f'not the rule, that this pair reverts. The clean p=0.03 in notebook 04 was one lucky window.')
