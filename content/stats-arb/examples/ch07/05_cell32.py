fig, axes = plt.subplots(2, 2, figsize=(12, 6.4), sharex=True)
for ax, (name, ser) in zip(axes.ravel(), controls.items()):
    z = (np.asarray(ser, float) - np.nanmean(ser)) / np.nanstd(ser)   # standardise to compare shapes
    col = C['green'] if name.endswith('(real)') else C['grey']
    ax.plot(z, color=col, lw=0.9)
    ax.axhline(0, color=C['amber'], lw=1.0, ls='--')
    ax.set_title(name, fontsize=10.5)
    ax.set_ylabel('z')
fig.suptitle('Standardised: a tradeable spread keeps coming home; the controls do not',
             fontweight='bold', y=1.01)
plt.tight_layout(); plt.show()
