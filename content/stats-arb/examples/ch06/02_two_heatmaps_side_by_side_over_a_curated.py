
# Two heatmaps side by side, over a curated 13-name set spanning IT / Banks / Metals / Auto.
HN = ["TCS","INFY","HCLTECH","WIPRO","HDFCBANK","ICICIBANK","KOTAKBANK","AXISBANK",
      "TATASTEEL","JSWSTEEL","HINDALCO","MARUTI","M&M"]
sub_r = rets[HN].dropna()
sub_l = lp[HN].dropna()
corrM = sub_r.corr()
pM = pd.DataFrame(np.nan, index=HN, columns=HN)
for i, a in enumerate(HN):
    for b in HN[i+1:]:
        p = coint(sub_l[a], sub_l[b])[1]
        pM.loc[a, b] = pM.loc[b, a] = p
np.fill_diagonal(pM.values, 0.0)

mask = np.triu(np.ones_like(corrM, dtype=bool), k=1)
fig, ax = plt.subplots(1, 2, figsize=(15, 6.4))
sns.heatmap(corrM, mask=mask, ax=ax[0], cmap="mako", vmin=0, vmax=1,
            annot=True, fmt=".2f", annot_kws={"size": 7}, cbar_kws={"shrink": .8},
            linewidths=.5, linecolor="#0d1117")
ax[0].set_title("Return correlation  (bright = move together)")
sns.heatmap(pM, mask=mask, ax=ax[1], cmap="rocket_r", vmin=0, vmax=1,
            annot=True, fmt=".2f", annot_kws={"size": 7}, cbar_kws={"shrink": .8},
            linewidths=.5, linecolor="#0d1117")
ax[1].set_title("Cointegration p-value  (bright = cointegrated, p<0.05)")
plt.tight_layout(); plt.show()
print("The bright sector blocks on the left (high correlation) do NOT line up with the bright cells")
print("on the right (low coint p). Correlation clusters by sector; cointegration does not.")
