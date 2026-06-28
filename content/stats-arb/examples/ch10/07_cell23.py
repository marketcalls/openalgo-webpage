def rolling_beta(la, lb, w=120):
    idx, out = la.index, {}
    for i in range(w, len(la)):
        out[idx[i]] = np.polyfit(lb.values[i-w:i], la.values[i-w:i], 1)[0]
    return pd.Series(out)

rb = rolling_beta(la, lb, w=120)
fig, ax = plt.subplots(figsize=(12, 5.0))
ax.plot(rb.index, rb.values, color=C['teal'], lw=1.6, label='rolling 120d hedge ratio b')
ax.axhline(beta, color=C['amber'], ls='--', lw=1.6, label=f'frozen TRAIN b = {beta:.3f} (what the strategy uses everywhere)')
ax.fill_between(rb.index, rb.mean()-rb.std(), rb.mean()+rb.std(), color=C['teal'], alpha=0.08)
ax.axvspan(pd.Timestamp(OO0), pd.Timestamp(OO1), color=C['amber'], alpha=0.06)
ax.set_ylabel('hedge ratio b'); ax.set_title('The "constant" hedge ratio is not constant')
ax.legend(fontsize=9, loc='upper left')
plt.tight_layout(); plt.show()

print(f'rolling b: min {rb.min():.3f}  max {rb.max():.3f}  mean {rb.mean():.3f}  sd {rb.std():.3f}')
print(f'it swings {(rb.max()-rb.min())/abs(rb.mean())*100:.0f}% of its own mean, and the frozen TRAIN b sits')
print(f'{(beta-rb.loc[OO0:].mean())/rb.loc[OO0:].mean()*100:+.0f}% away from the TEST-period average -- so out of sample')
print(f'the spread we trade is mis-hedged by construction, leaking directional risk that has nothing to do with reversion.')
