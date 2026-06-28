nifty_sessions = pd.DatetimeIndex(idx_of['NIFTY'])
def internal_gaps(symbol):
    have = pd.DatetimeIndex(idx_of[symbol])
    win = nifty_sessions[(nifty_sessions >= have.min()) & (nifty_sessions <= have.max())]
    return int(len(win.difference(have)))

gaps = pd.Series({s: internal_gaps(s) for s in idx_of if s != 'NIFTY'}).sort_values(ascending=False)
print(f'sessions in the NIFTY calendar (window): {len(nifty_sessions)}')
print(f'symbols with zero internal gaps: {(gaps == 0).sum()} of {len(gaps)}')
print(f'worst-case internal gaps for any single name: {gaps.max()} sessions\n')
print('most gaps (a handful is normal: trading halts, suspensions, calendar edge effects):')
print(gaps.head(10))

top = gaps[gaps > 0].head(15)
if len(top):
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.barplot(x=top.values, y=top.index, hue=top.index, palette='rocket', legend=False, ax=ax)
    ax.set_title('Internal missing sessions vs the NIFTY calendar (top names)')
    ax.set_xlabel('missing sessions'); ax.set_ylabel('')
    plt.tight_layout(); plt.show()
else:
    print('no internal gaps anywhere - a clean cache')
