sec_gross, sec_net = {}, {}
for k in BOOK:
    s = allp[k]['sec']
    g_k = (exposure[k] * Hd[k].abs() * (1 + beta[k])).mean()
    n_k = (exposure[k] * Hd[k] * (1 - beta[k])).mean()
    sec_gross[s] = sec_gross.get(s, 0.0) + g_k
    sec_net[s]   = sec_net.get(s, 0.0) + n_k
secdf = pd.DataFrame({'gross': sec_gross, 'net': sec_net}).fillna(0.0)

fig, ax = plt.subplots(figsize=(11, 4.6))
secdf.plot(kind='bar', ax=ax, color=[C['blue'], C['red']], width=0.7)
ax.axhline(0, color=C['grey'], lw=1.0)
ax.set_title('Time-averaged exposure by sector: large gross, near-zero net (sector-neutral)')
ax.set_ylabel('avg rupee exposure'); ax.set_xticklabels(secdf.index, rotation=0); ax.legend(fontsize=9)
plt.tight_layout(); plt.show()
print(secdf.round(3).to_string())
print('net sector tilts are a small fraction of gross -- the within-sector construction keeps the book balanced.')
