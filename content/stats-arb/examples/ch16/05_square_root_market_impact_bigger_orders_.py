# Square-root market impact: bigger orders move the price ~ sqrt(participation).
name = "RELIANCE"
dd = load(name, interval="D", start="2024-06-01", end="2026-06-26")
daily_vol_bps = np.log(dd["close"]).diff().std() * 1e4          # daily return vol, from real data
Y = 0.6                                                          # square-root-law coefficient (~0.3-1 in the literature)
part = np.linspace(0.002, 0.20, 200)                            # order as a fraction of ADV
impact = Y * daily_vol_bps * np.sqrt(part)
cap = 0.10                                                      # our participation cap: never exceed 10% of volume
impact_at_cap = Y * daily_vol_bps * np.sqrt(cap)

fig, ax = plt.subplots(figsize=(11, 4.8))
ax.plot(part*100, impact, color=C["purple"], lw=2.4)
ax.axvline(cap*100, color=C["red"], ls="--", lw=1.6, label=f"participation cap = {cap:.0%}")
ax.scatter([cap*100], [impact_at_cap], color=C["red"], zorder=5)
ax.set_title(f"{name}: modelled market impact vs participation (daily vol {daily_vol_bps:.0f} bps)")
ax.set_xlabel("order size as % of volume traded"); ax.set_ylabel("price impact (bps)"); ax.legend()
plt.tight_layout(); plt.show()
for pv in (0.01, 0.05, 0.10):
    print(f"at {pv:4.0%} participation -> impact ~ {Y*daily_vol_bps*np.sqrt(pv):4.1f} bps")
print("Impact is convex-down: doubling size does NOT double impact, but it never stops growing either.")
