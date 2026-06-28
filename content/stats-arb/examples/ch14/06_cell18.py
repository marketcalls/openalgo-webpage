wbook   = pd.Series(w_rp, index=BOOK)                       # risk-parity weights for the live book
book_pre = (Rvt[BOOK] * wbook).sum(axis=1)
pscale   = TARGET_PORT_VOL / (book_pre.loc[TR0:TR1].std() * np.sqrt(ANN))
exposure = {k: float(pscale * wbook[k] * lev[k]) for k in BOOK}   # rupee scale of each pair's 1-unit long spread
book_gross = book_pre * pscale

# realistic CNC round-trip cost charged per unit change in each pair's held position
COST_RT   = pair_roundtrip_cost_frac(product='CNC')
COST_TURN = 0.5 * COST_RT
turnover  = sum(Hd[k].diff().abs().fillna(0.0) * exposure[k] for k in BOOK)
book_net  = book_gross - COST_TURN * turnover

g, n = perf(book_gross.loc[TR0:OO1]), perf(book_net.loc[TR0:OO1])
no   = perf(book_net.loc[OO0:OO1])
eg, en = eqc(book_gross.loc[TR0:OO1]), eqc(book_net.loc[TR0:OO1])
dd   = en/en.cummax() - 1

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12.5, 7.0), sharex=True, gridspec_kw=dict(height_ratios=[3,1]))
ax1.plot(eg.index, eg.values, color=C['green'], lw=2.0, label=f"GROSS  Sharpe {g['sharpe']:.2f}  {g['total']*100:+.0f}%")
ax1.plot(en.index, en.values, color=C['blue'],  lw=2.0, label=f"NET of CNC costs  Sharpe {n['sharpe']:.2f}  {n['total']*100:+.0f}%")
ax1.fill_between(eg.index, en.values, eg.values, color=C['red'], alpha=0.10, label='eaten by costs')
ax1.axvline(pd.Timestamp(OO0), color=C['grey'], ls='--', lw=1.0); ax1.axhline(1, color=C['grey'], ls=':', lw=0.8)
ax1.set_title(f'The assembled six-pair book (risk-parity, vol-targeted to {TARGET_PORT_VOL*100:.0f}%)')
ax1.set_ylabel('growth of Rs 1'); ax1.legend(fontsize=9, loc='upper left')
ax2.fill_between(dd.index, dd.values*100, 0, color=C['red'], alpha=0.35)
ax2.set_ylabel('drawdown %'); ax2.set_xlabel('')
plt.tight_layout(); plt.show()

print(f"book round-trip cost ~ {COST_RT*1e4:.0f} bps/leg-notional  |  net Sharpe full {n['sharpe']:.2f}  net OOS {no['sharpe']:.2f}")
print(f"net out-of-sample: total {no['total']*100:+.1f}%   max drawdown {no['maxdd']*100:.1f}%   "
      f"(six pairs are steadier than the single pair of nb 07, but the OOS haircut is real)")
