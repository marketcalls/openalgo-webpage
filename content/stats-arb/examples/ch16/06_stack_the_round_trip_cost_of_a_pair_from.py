# Stack the round-trip cost of a pair from the measured components.
hs   = cs_repr / 2                                   # half-spread, bps, measured
imp  = impact_at_cap                                 # impact, bps, modelled at the cap
stat = equity_cost_bps("MIS", half_spread_bps=0, impact_bps=0)   # statutory only, per fill
comp = pd.Series({
    "statutory (STT, exch, GST, stamp)": stat * 4,   # 4 fills
    "half-spread x 4 fills":             hs   * 4,
    "market impact x 4 fills":           imp  * 4,
})
total = comp.sum()

fig, ax = plt.subplots(figsize=(11, 2.8))
left = 0
colmap = [C["grey"], C["blue"], C["purple"]]
for (lbl, val), col in zip(comp.items(), colmap):
    ax.barh(0, val, left=left, color=col, label=f"{lbl}  ({val:.0f} bps)")
    left += val
ax.set_xlim(0, total*1.02); ax.set_yticks([])
ax.set_title(f"Pair round-trip cost (MIS), measured: {total:.0f} bps of leg notional")
ax.set_xlabel("bps"); ax.legend(loc="lower right", fontsize=8, ncol=1)
plt.tight_layout(); plt.show()
print(f"TOTAL round-trip cost ~ {total:.0f} bps  ({total/100:.2f}% of one leg's notional).")
print(f"Break-even: your average winning trade must net MORE than {total:.0f} bps just to pay the market.")
print("If your backtested edge per trade is, say, 30-50 bps, this single number decides whether it lives.")
