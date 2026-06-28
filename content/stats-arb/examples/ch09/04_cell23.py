fig, ax = plt.subplots(figsize=(12, 4.8))
ax.plot(equity.index, equity.values, color=C['green'], lw=1.7, label='strategy equity (gross, in-sample)')
ax.axhline(1.0, color=C['grey'], ls='--', lw=1)
y0, y1 = equity.min()*0.98, equity.max()*1.02
ax.fill_between(pos_exec.index, y0, y1, where=(pos_exec != 0).values, color=C['blue'], alpha=0.06, step='pre',
                label='in market')
ax.set_ylim(y0, y1)
ax.set_title(f'In-sample equity curve  ({A_name}/{B_name}, gross of costs)')
ax.set_ylabel('growth of 1 (per-leg notional)'); ax.legend(fontsize=9, loc='upper left')
plt.tight_layout(); plt.show()

roll_max = equity.cummax(); dd = equity/roll_max - 1
print(f'max drawdown (in-sample, gross): {dd.min():.1%}')
