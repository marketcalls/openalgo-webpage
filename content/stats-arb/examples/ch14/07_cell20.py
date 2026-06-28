beta = {k: allp[k]['beta'] for k in BOOK}
long_rupee  = sum(exposure[k] * Hd[k].abs()                    for k in BOOK)   # |long A leg|
short_rupee = sum(exposure[k] * Hd[k].abs() * beta[k]          for k in BOOK)   # |short b*B leg|
gross_exp   = long_rupee + short_rupee
net_exp     = sum(exposure[k] * Hd[k] * (1 - beta[k])          for k in BOOK)   # signed rupee tilt

fig, ax = plt.subplots(figsize=(12.5, 4.8))
ax.fill_between(gross_exp.index, 0, gross_exp.values, color=C['blue'], alpha=0.18, label='gross exposure (both legs)')
ax.plot(net_exp.index, net_exp.values, color=C['red'], lw=1.3, label='net exposure (directional tilt)')
ax.axhline(0, color=C['grey'], ls='--', lw=0.8)
ax.set_title('Book exposure through time: gross breathes, net stays near zero')
ax.set_ylabel('rupee exposure per Rs 1 of book'); ax.legend(fontsize=9, loc='upper left')
plt.tight_layout(); plt.show()

print(f'gross exposure: mean {gross_exp.mean():.2f}x   max {gross_exp.max():.2f}x   (leverage you actually trade & margin)')
print(f'net   exposure: mean {net_exp.mean():+.3f}x   sd {net_exp.std():.3f}   (small, because each pair is internally hedged)')
