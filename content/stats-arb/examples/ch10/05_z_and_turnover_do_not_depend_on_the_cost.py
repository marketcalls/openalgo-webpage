# z and turnover do NOT depend on the cost, so compute the gross/turn once and re-price.
gross_o, turn_o = bt['gross'], bt['turn']
def net_sharpe(cost, sl):
    return perf((gross_o - cost * turn_o).loc[sl])['sharpe']

rts = np.linspace(0, 0.025, 40)                       # round-trip cost from 0 to 2.5%
is_sh  = [net_sharpe(0.5*rt, isS) for rt in rts]
oos_sh = [net_sharpe(0.5*rt, ooS) for rt in rts]
# breakeven round-trip cost where OOS net Sharpe hits zero
be = next((rts[i] for i in range(len(rts)) if oos_sh[i] <= 0), np.nan)

fig, axes = plt.subplots(1, 2, figsize=(13, 5.0), gridspec_kw=dict(width_ratios=[3, 2]))
ax = axes[0]
ax.plot(rts*100, is_sh,  color=C['blue'], lw=2.2, label='in-sample net Sharpe')
ax.plot(rts*100, oos_sh, color=C['red'],  lw=2.2, label='out-of-sample net Sharpe')
ax.axhline(0, color=C['grey'], lw=1.0, ls='-')
ax.axvline(COST_RT*100, color=C['green'], ls='--', lw=1.6, label=f'realistic CNC = {COST_RT*100:.2f}%')
if np.isfinite(be):
    ax.axvline(be*100, color=C['amber'], ls=':', lw=1.6, label=f'OOS breakeven ~ {be*100:.1f}%')
ax.set_xlabel('assumed round-trip cost (%)'); ax.set_ylabel('net Sharpe')
ax.set_title('Net Sharpe vs assumed cost'); ax.legend(fontsize=9, loc='upper right')

# heatmap: sweep half-spread x impact (the two assumptions you can least defend)
hss = [0, 2, 4, 6, 10, 15]; ims = [0, 2, 4, 6, 10, 15]
M = np.array([[net_sharpe(0.5*pair_roundtrip_cost_frac(product='CNC', half_spread_bps=h, impact_bps=m), ooS)
               for m in ims] for h in hss])
sns.heatmap(M, ax=axes[1], xticklabels=ims, yticklabels=hss, annot=True, fmt='.2f',
            cmap='RdYlGn', center=0, cbar_kws=dict(label='OOS net Sharpe'))
axes[1].set_xlabel('impact (bps/leg)'); axes[1].set_ylabel('half-spread (bps/leg)')
axes[1].set_title('OOS net Sharpe vs spread & impact')
plt.tight_layout(); plt.show()

print(f'at the realistic CNC cost the OOS net Sharpe is {net_sharpe(COST_TURN, ooS):.2f}; '
      f'it reaches zero at a round-trip cost of ~{be*100:.1f}%.' if np.isfinite(be) else
      f'at the realistic CNC cost the OOS net Sharpe is {net_sharpe(COST_TURN, ooS):.2f}.')
print('The out-of-sample line sits far closer to the zero axis than the in-sample line: the edge that')
print('survives costs in-sample does not have the same cushion once it is out of sample.')
