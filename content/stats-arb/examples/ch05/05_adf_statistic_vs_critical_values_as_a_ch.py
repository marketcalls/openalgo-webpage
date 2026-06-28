# ADF statistic vs critical values, as a chart: more-negative = more evidence against unit root
labels = [f'{STOCK}\nlog price', f'{STOCK}\nlog returns']
stats  = [r_logp['stat'], r_ret['stat']]
colors = [C['red'] if not d['reject5'] else C['green'] for d in (r_logp, r_ret)]
crit   = r_ret['crit']   # same critical values (regression='c')

fig, ax = plt.subplots(figsize=(9.5, 5))
bars = ax.bar(labels, stats, color=colors, width=0.5, edgecolor='white', zorder=3)
for lvl, ls in [('1%', '-'), ('5%', '--'), ('10%', ':')]:
    ax.axhline(crit[lvl], color=C['amber'], lw=1.5, ls=ls, zorder=2,
               label=f'{lvl} critical = {crit[lvl]:.2f}')
ax.axhline(0, color=C['grey'], lw=1)
for b, s in zip(bars, stats):
    ax.text(b.get_x()+b.get_width()/2, s + (0.4 if s < 0 else -0.8), f'{s:.2f}',
            ha='center', va='bottom' if s < 0 else 'top', fontweight='bold')
ax.set_title('ADF statistic vs critical values (regression="c")\nbelow the dashed line = reject unit root = stationary')
ax.set_ylabel('ADF statistic (more negative = more stationary)')
ax.legend(fontsize=9, loc='lower left')
plt.tight_layout(); plt.show()
print("The price bar floats above all three critical lines (a unit root); the returns bar")
print("plunges far below them (decisively stationary). This is the whole notebook in one chart.")
