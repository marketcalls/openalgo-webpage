TARGET_PAIR_VOL = 0.08
TARGET_PORT_VOL = 0.10

raw_vol = U.loc[TR0:TR1].std() * np.sqrt(ANN)        # standalone vol of each 1-unit spread (train)
lev     = TARGET_PAIR_VOL / raw_vol                  # constant per-pair leverage (frozen on train)
Rvt     = R.mul(lev, axis=1)                          # vol-targeted, signal-gated pair returns

# naive (one raw unit each) vs vol-targeted (equal risk), both scaled to the SAME 10% book vol
naive_pre = R.mean(axis=1)
vt_pre    = Rvt.mean(axis=1)
s_naive   = TARGET_PORT_VOL / (naive_pre.loc[TR0:TR1].std()*np.sqrt(ANN))
s_vt      = TARGET_PORT_VOL / (vt_pre.loc[TR0:TR1].std()*np.sqrt(ANN))
naive_bk  = naive_pre * s_naive
vt_bk     = vt_pre * s_vt

fig, axes = plt.subplots(1, 2, figsize=(13.5, 5.0), gridspec_kw=dict(width_ratios=[2, 3]))
ax = axes[0]
sns.barplot(x=raw_vol.values*100, y=raw_vol.index, hue=raw_vol.index, palette='flare', legend=False, ax=ax)
ax.axvline(TARGET_PAIR_VOL*100, color=C['green'], ls='--', lw=1.6)
ax.text(TARGET_PAIR_VOL*100, 5.4, f'  target {TARGET_PAIR_VOL*100:.0f}%', color=C['green'], fontsize=9)
ax.set_title('Standalone vol per 1-unit pair (train)'); ax.set_xlabel('annualized vol %'); ax.set_ylabel('')

ax = axes[1]
en, ev = eqc(naive_bk.loc[TR0:OO1]), eqc(vt_bk.loc[TR0:OO1])
pn, pv = perf(naive_bk.loc[TR0:OO1]), perf(vt_bk.loc[TR0:OO1])
ax.plot(en.index, en.values, color=C['grey'],  lw=1.8, label=f"naive (M&M dominates)  Sharpe {pn['sharpe']:.2f}")
ax.plot(ev.index, ev.values, color=C['green'], lw=2.0, label=f"vol-targeted (equal risk)  Sharpe {pv['sharpe']:.2f}")
ax.axvline(pd.Timestamp(OO0), color=C['grey'], ls='--', lw=1.0); ax.axhline(1, color=C['grey'], ls=':', lw=0.8)
ax.set_title(f'Naive vs vol-targeted book (both at {TARGET_PORT_VOL*100:.0f}% vol)')
ax.set_ylabel('growth of Rs 1'); ax.legend(fontsize=9, loc='upper left')
plt.tight_layout(); plt.show()

print('per-pair leverage (train):'); print(lev.round(2).to_string())
print(f"\nnaive book Sharpe {pn['sharpe']:.2f}  vs  vol-targeted {pv['sharpe']:.2f}   "
      f"(equalizing risk stops one pair owning the book)")
