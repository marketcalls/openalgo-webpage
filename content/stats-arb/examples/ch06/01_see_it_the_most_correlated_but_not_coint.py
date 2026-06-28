
# See it: the most-correlated-but-not-cointegrated pair vs a genuinely cointegrated one.
notc_pair  = tuple(res[res.coint_p >= 0.10].sort_values("ret_corr", ascending=False).iloc[0][["A", "B"]])
coint_pair = tuple(res.sort_values("coint_p").iloc[0][["A", "B"]])

def ols_spread(a, b):
    sub = pd.concat([lp[a], lp[b]], axis=1).dropna(); sub.columns = ["a", "b"]
    m = sm.OLS(sub["a"], sm.add_constant(sub["b"])).fit()
    resid = sub["a"] - m.predict(sm.add_constant(sub["b"]))   # the cointegrating spread
    return resid

fig, axes = plt.subplots(2, 2, figsize=(13, 7.6))
for j, (pair, tag, col) in enumerate([(notc_pair, "correlated, NOT cointegrated", C["red"]),
                                       (coint_pair, "cointegrated", C["green"])]):
    a, b = pair
    sub = px[[a, b]].dropna()
    reb = sub / sub.iloc[0] * 100
    ax = axes[0, j]
    ax.plot(reb.index, reb[a], color=C["blue"],  lw=1.4, label=a)
    ax.plot(reb.index, reb[b], color=C["amber"], lw=1.4, label=b)
    ax.set_title(f"{a} vs {b}  -  {tag}", color=col)
    ax.legend(fontsize=8, loc="upper left"); ax.set_ylabel("rebased to 100")

    sp = ols_spread(a, b)
    z  = (sp - sp.mean()) / sp.std()
    axb = axes[1, j]
    axb.plot(z.index, z.values, color=col, lw=1.0)
    axb.axhline(0, color=C["grey"], lw=1)
    for k in (2, -2):
        axb.axhline(k, color=C["grey"], ls="--", lw=0.8)
    axb.fill_between(z.index, -2, 2, color=C["grey"], alpha=0.08)
    axb.set_title(f"spread z-score (OLS residual)  -  range {z.min():.1f} to {z.max():.1f}")
    axb.set_ylabel("z")
plt.tight_layout(); plt.show()

print(f"Not-cointegrated pair {notc_pair}: the spread wanders to extreme z and stays there - no anchor to trade.")
print(f"Cointegrated pair     {coint_pair}: the spread keeps snapping back through zero - that is the edge.")
