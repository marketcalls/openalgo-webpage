fig, axes = plt.subplots(2, 2, figsize=(12, 8))
for ax, sec in zip(axes.ravel(), ['Banks','IT','Metals','Energy']):
    sub = px[[s for s in SECTORS[sec] if s in px.columns]].dropna()
    reb = sub / sub.iloc[0] * 100
    for col in reb.columns:
        ax.plot(reb.index, reb[col], label=col, lw=1.4)
    ax.set_title(f'{sec}: rebased to 100'); ax.legend(fontsize=8, loc='upper left')
plt.tight_layout(); plt.show()
