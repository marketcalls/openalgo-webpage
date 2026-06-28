# (1) A reusable slippage model: cost in bps for one fill at a chosen participation.
def slippage_bps(participation, spread_bps=None, daily_vol_bps=130.0, Y=0.6):
    """Per-fill slippage = half the spread + square-root impact at this participation."""
    spread_bps = cs_repr if spread_bps is None else spread_bps
    return spread_bps/2 + Y*daily_vol_bps*np.sqrt(max(participation, 1e-6))

# (2) A participation cap turned into a liquidation HORIZON, from real 5m volume.
name = "RELIANCE"
d5 = load(name, interval="5m", start="2026-04-01", end="2026-06-26", source="db")
bar_val_cr = (d5["close"] * d5["volume"]).median() / 1e7          # typical 5m bar traded value, Rs cr
position_cr = 5.0                                                 # we want to exit a Rs 5 cr leg
caps = np.array([0.02, 0.05, 0.10, 0.20])
bars_to_exit = position_cr / (caps * bar_val_cr)                  # 5m bars needed at each cap
mins_to_exit = bars_to_exit * 5

fig, ax = plt.subplots(figsize=(11, 4.4))
sns.barplot(x=[f"{c:.0%}" for c in caps], y=mins_to_exit, color=C["teal"], ax=ax)
for i, m in enumerate(mins_to_exit):
    ax.text(i, m, f"{m:.0f} min", ha="center", va="bottom", fontsize=10)
ax.set_title(f"{name}: minutes to exit a Rs {position_cr:.0f} cr leg vs participation cap "
             f"(typical 5m bar ~ Rs {bar_val_cr:.1f} cr)")
ax.set_xlabel("participation cap (% of bar volume)"); ax.set_ylabel("minutes to fully exit")
plt.tight_layout(); plt.show()
print(f"slippage_bps(1%)  = {slippage_bps(0.01):.1f} bps/fill   slippage_bps(10%) = {slippage_bps(0.10):.1f} bps/fill")
print("Read: a tight cap protects your price but lengthens your exit - and a long exit is exactly")
print("when a circuit, a gap or a recall can trap you. The cap is a trade-off, not a free safety.")
