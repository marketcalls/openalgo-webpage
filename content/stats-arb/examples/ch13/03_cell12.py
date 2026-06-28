K = 2                                            # signal lookback (days); we sweep k later
def build_signal(R, k=K):
    """Negative k-day cumulative residual, cross-sectionally demeaned (dollar-neutral)."""
    sig = -R.rolling(k).sum()
    return sig.sub(sig.mean(axis=1), axis=0)

sig = build_signal(residSN, K)
last = sig.iloc[-1].dropna().sort_values()
day  = sig.index[-1].date()

fig, (axL, axR) = plt.subplots(1, 2, figsize=(13, 5), gridspec_kw=dict(width_ratios=[1.05, 1]))
sns.histplot(sig.stack(), bins=120, color=C['teal'], ax=axL, stat='density')
axL.set_title(f'Cross-sectional signal distribution (all names, all days, k={K})')
axL.set_xlabel('signal = -(k-day residual), demeaned'); axL.axvline(0, color=C['red'], ls='--', lw=1.2)

shortlist = pd.concat([last.tail(6), last.head(6)])         # top = buy, bottom = short
colors = [C['green']]*6 + [C['red']]*6
axR.barh(shortlist.index, shortlist.values, color=colors)
axR.axvline(0, color=C['grey'], lw=.8)
axR.set_title(f'Book on {day}: green = buy (residual losers), red = short (winners)')
axR.set_xlabel('signal'); axR.invert_yaxis()
plt.tight_layout(); plt.show()
print(f'on {day}: longs = {list(last.tail(6).index)[::-1]}')
print(f'         shorts = {list(last.head(6).index)}')
