reb = win / win.iloc[0] * 100.0
fig, ax = plt.subplots(figsize=(12, 5))
for c, col in zip(reb.columns, [C['blue'], C['amber'], C['green'], C['red'], C['purple']]):
    ax.plot(reb.index, reb[c], lw=1.5, color=col, label=c)
ax.set_title(f'Five Nifty banks, rebased to 100  ({WIN0[:4]}-{WIN1[:4]})')
ax.set_ylabel('rebased level'); ax.legend(ncol=5, fontsize=9, loc='upper left')
plt.tight_layout(); plt.show()
sp = (reb.max(axis=1) - reb.min(axis=1))
print(f'cross-sectional spread of the rebased lines: min {sp.min():.0f}, max {sp.max():.0f} index points')
print('they wander apart and back -- exactly the structure Johansen is built to quantify')
