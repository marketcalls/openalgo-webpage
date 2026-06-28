# Cost-of-carry basis sketch. Real spot, MODELLED basis (no live futures in the DB).
name = 'RELIANCE'
S = float(load(name)['close'].iloc[-1])
r, q = 0.065, 0.006          # illustrative financing rate and dividend yield
days = np.arange(1, 61)
basis = S * np.exp((r - q) * days / 365.0) - S
fig, ax = plt.subplots(figsize=(11, 4.4))
sns.lineplot(x=days, y=basis, color=C['amber'], lw=2, ax=ax)
ax.axhline(0, color=C['grey'], lw=0.8)
ax.set_title(f'{name}: MODELLED fair futures basis vs days to expiry '
             f'(spot Rs {S:,.0f}, r={r:.1%}, q={q:.1%})')
ax.set_xlabel('calendar days to expiry'); ax.set_ylabel('fair basis  F - S  (Rs)')
plt.tight_layout(); plt.show()
b30 = S * np.exp((r - q) * 30/365.0) - S
print(f'~30-day fair basis ~ Rs {b30:,.2f}  ({b30/S*1e4:.1f} bps of spot).')
print('Selling the future to short, this premium converges to zero by expiry - a small')
print('tailwind for the short when r > q, but real quotes also embed demand/borrow and roll cost.')
