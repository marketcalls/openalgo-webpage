def sector_pmatrix(names):
    names = [s for s in names if s in px.columns]
    M = pd.DataFrame(np.nan, index=names, columns=names)
    for a, b in itertools.combinations(names, 2):
        p, n = coint_p(a, b, *IS)
        if n >= MIN_IS:
            M.loc[a, b] = M.loc[b, a] = p
    np.fill_diagonal(M.values, 0.0)
    return M

show = ["Banks", "IT", "Energy", "Auto", "Pharma", "NBFC_Fin"]
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
for ax, sec in zip(axes.ravel(), show):
    M = sector_pmatrix(SECTORS[sec])
    mask = np.triu(np.ones_like(M, dtype=bool), k=1)
    sns.heatmap(M, mask=mask, ax=ax, cmap="rocket_r", vmin=0, vmax=1,
                annot=True, fmt=".2f", annot_kws={"size": 8}, cbar=False,
                linewidths=.5, linecolor="#0d1117")
    ax.set_title(f"{sec}  (bright = coint, p<0.05)", fontsize=11)
    ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha="right", fontsize=8)
    ax.set_yticklabels(ax.get_yticklabels(), rotation=0, fontsize=8)
plt.suptitle("In-sample cointegration p-values within each sector", y=1.01,
             fontsize=13, fontweight="bold")
plt.tight_layout(); plt.show()
