entries = pos_exec[(pos_exec != 0) & (pos_exec.shift(1).fillna(0) == 0)].index
exits    = pos_exec[(pos_exec == 0) & (pos_exec.shift(1).fillna(0) != 0)].index

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(13, 8), sharex=True, gridspec_kw=dict(height_ratios=[1.1, 1]))

# --- top: spread + rolling mean + bands + trade markers
sns.lineplot(x=spread.index, y=spread.values, color=C['purple'], lw=1.0, ax=ax1, label='spread')
ax1.plot(roll_mean.index, roll_mean.values, color=C['grey'], lw=1.1, ls='--', label=f'rolling mean ({Z_WIN}d)')
ax1.plot(roll_mean.index, (roll_mean + 2*roll_std).values,    color=C['amber'], lw=0.9, ls=':')
ax1.plot(roll_mean.index, (roll_mean - 2*roll_std).values,    color=C['amber'], lw=0.9, ls=':', label='+/-2 sd (enter)')
ax1.plot(roll_mean.index, (roll_mean + STOP*roll_std).values, color=C['red'],   lw=0.9, ls=':')
ax1.plot(roll_mean.index, (roll_mean - STOP*roll_std).values, color=C['red'],   lw=0.9, ls=':', label='+/-3.5 sd (stop)')
ax1.scatter(entries, spread.reindex(entries), marker='^', s=60, color=C['green'], zorder=5, label='entry (next-bar fill)')
ax1.scatter(exits,   spread.reindex(exits),   marker='x', s=55, color=C['red'],   zorder=5, label='exit')
ax1.set_title(f'{A_name} - {beta:.3f}*{B_name}: spread with rolling mean and bands')
ax1.set_ylabel('spread (log)'); ax1.legend(fontsize=8, ncol=3, loc='upper left')

# --- bottom: z-score + shaded zones + markers
ax2.set_ylim(-4.5, 4.5)
ax2.axhspan(-EXIT, EXIT, color=C['green'], alpha=0.12)
ax2.axhspan(ENTER, STOP, color=C['amber'], alpha=0.12); ax2.axhspan(-STOP, -ENTER, color=C['amber'], alpha=0.12)
ax2.axhspan(STOP, 4.5, color=C['red'], alpha=0.12);     ax2.axhspan(-4.5, -STOP, color=C['red'], alpha=0.12)
sns.lineplot(x=z.index, y=z.values, color=C['blue'], lw=0.9, ax=ax2)
for lvl in [ENTER, -ENTER, EXIT, -EXIT, STOP, -STOP]: ax2.axhline(lvl, color=C['grey'], ls=':', lw=0.7)
ax2.scatter(entries, z.reindex(entries), marker='^', s=60, color=C['green'], zorder=5)
ax2.scatter(exits,   z.reindex(exits),   marker='x', s=55, color=C['red'],   zorder=5)
ax2.set_title('z-score with shaded zones: green = exit (|z|<0.5), amber = entry (2<|z|<3.5), red = stop (|z|>3.5)')
ax2.set_ylabel('z'); ax2.set_xlabel('')
plt.tight_layout(); plt.show()
