def rolling_coint_p(la, lb, w=252, step=10):
    out = {}
    for i in range(w, len(la), step):
        try: out[la.index[i]] = coint(la.iloc[i-w:i], lb.iloc[i-w:i])[1]
        except Exception: pass
    return pd.Series(out)

RETIRE, READMIT, K = 0.10, 0.05, 3
rcp = pd.DataFrame({k: rolling_coint_p(np.log(px[allp[k]['a']]), np.log(px[allp[k]['b']])) for k in BOOK})

def hysteresis(p):
    live, breach, recov, out = True, 0, 0, []
    for v in p.values:
        if np.isnan(v): out.append(live); continue
        if live:
            breach = breach+1 if v > RETIRE else 0
            if breach >= K: live, breach = False, 0
        else:
            recov = recov+1 if v < READMIT else 0
            if recov >= K: live, recov = True, 0
        out.append(live)
    return pd.Series(out, index=p.index)
status = rcp.apply(hysteresis)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12.5, 7.4), sharex=True, gridspec_kw=dict(height_ratios=[2.2, 1]))
sns.heatmap(status.T.astype(int), ax=ax1, cmap=sns.color_palette([C['red'], C['green']]), cbar=False,
            yticklabels=BOOK, xticklabels=False)
ax1.set_title('Live (green) vs retired (red): a pair is dropped when rolling cointegration dies')
ax1.tick_params(axis='y', rotation=0)
nlive = status.sum(axis=1)
ax2.plot(nlive.index, nlive.values, color=C['blue'], lw=1.6, drawstyle='steps-post')
ax2.fill_between(nlive.index, 0, nlive.values, color=C['blue'], alpha=0.12, step='post')
ax2.set_ylim(0, 6.3); ax2.set_ylabel('# live pairs'); ax2.set_title('Tradeable pairs through time (a disciplined book often sits half-empty)')
# map heatmap x to dates
xt = np.linspace(0, len(status.index)-1, 6).astype(int)
ax1.set_xticks(xt); ax1.set_xticklabels([status.index[i].date() for i in xt], rotation=0)
plt.tight_layout(); plt.show()

print('fraction of time each pair is LIVE by this rule:')
print((status.mean()).round(2).to_string())
print(f"\nmedian live pairs: {int(nlive.median())} of 6.  The honest reading: these relationships pass a rolling")
print("cointegration screen only a minority of the time -- a static six-pair book is mostly running on faith.")
