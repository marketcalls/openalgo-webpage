fig, ax = plt.subplots(figsize=(7.6, 5.6))
sns.regplot(x=h['sl'].values, y=h['ds'].values, ax=ax,
            scatter_kws=dict(s=10, alpha=0.3, color=C['grey']),
            line_kws=dict(color=C['red'], lw=2.4))
ax.axhline(0, color=C['grey'], lw=0.8, ls=':'); ax.axvline(mu, color=C['grey'], lw=0.8, ls=':')
ax.set_xlabel('spread level  s(t-1)'); ax.set_ylabel('next-day change  ds(t)')
ax.set_title(f'AR(1) reversion: slope phi = {h["phi"]:.3f} < 0  =>  half-life {h["half_life"]:.0f}d')
plt.tight_layout(); plt.show()
