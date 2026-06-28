import matplotlib.dates as mdates
ordsp = cov.sort_values('first', ascending=False).index.tolist()
fig, ax = plt.subplots(figsize=(11, 12))
common_last = pd.to_datetime(cov['last']).max()
for i, s in enumerate(ordsp):
    a, b = pd.to_datetime(cov.loc[s, 'first']), pd.to_datetime(cov.loc[s, 'last'])
    short = cov.loc[s, 'flag'] == 'SHORT'
    stale = (common_last - b).days > 7
    col = C['red'] if stale else (C['amber'] if short else C['blue'])
    ax.plot([a, b], [i, i], lw=4, color=col, solid_capstyle='round')
ax.set_yticks(range(len(ordsp))); ax.set_yticklabels(ordsp, fontsize=7)
ax.set_ylim(-1, len(ordsp))
ax.xaxis.set_major_locator(mdates.YearLocator()); ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
ax.set_title('Cache coverage span per series  (amber = shorter history, blue = full, red = stale)')
plt.tight_layout(); plt.show()
print('all series end on/around:', cov["last"].max(), '| earliest start:', cov["first"].min())
