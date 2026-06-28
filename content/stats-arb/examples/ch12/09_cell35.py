one_leg_oneway = equity_cost_bps(product='MIS') / 1e4      # fraction of notional, one leg, one way
def basket_roundtrip_frac(L):       # enter L legs + exit L legs
    return 2 * L * one_leg_oneway
legs = np.arange(2, 6)
costs_bps = np.array([basket_roundtrip_frac(L) for L in legs]) * 1e4
fig, ax = plt.subplots(figsize=(10, 4.4))
sns.barplot(x=legs, y=costs_bps, palette='rocket', ax=ax)
for i, cbp in enumerate(costs_bps):
    ax.text(i, cbp + 1, f'{cbp:.0f} bps', ha='center', fontsize=10, fontweight='bold')
ax.set_title('Round-trip cost grows linearly with basket legs (intraday MIS model)')
ax.set_xlabel('legs in basket'); ax.set_ylabel('round-trip cost (bps of notional)')
plt.tight_layout(); plt.show()
print(f'one leg, one way ~ {one_leg_oneway*1e4:.1f} bps ; a 2-leg pair round trip ~ {basket_roundtrip_frac(2)*1e4:.0f} bps ;'
      f' a 5-leg basket ~ {basket_roundtrip_frac(5)*1e4:.0f} bps')
print('and a basket trades MORE often per name as any single leg drags the spread across a threshold')
