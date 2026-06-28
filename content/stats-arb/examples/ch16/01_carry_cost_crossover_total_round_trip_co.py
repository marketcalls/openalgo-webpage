# Carry-cost crossover: total round-trip cost (bps of leg notional) vs holding period.
# Uses the COST model. Spread/impact defaults are validated against real 5m data later.
days = np.arange(1, 121)

# one full entry+exit round trip for a PAIR (4 fills), as bps of one leg's notional
rt_pair_bps = pair_roundtrip_cost_frac("MIS") * 1e4          # ~ statutory + spread + impact, x4
roll_bps    = pair_roundtrip_cost_frac("MIS") * 1e4 * 0.5    # a futures roll ~ half a full round trip
slb_fee_ann = 0.03                                           # 3%/yr representative borrow fee (lumpy!)
fut_fin_ann = 0.0                                            # net financing ~neutral for a short (r approx q effect)

# Intraday: you cannot hold overnight, so to *carry* H days you re-establish the pair each day.
cost_intraday = rt_pair_bps * days
# SLB: pay one round trip, then borrow fee accrues on both legs' notional.
cost_slb = rt_pair_bps + slb_fee_ann * 1e4 * days / 365.0
# Futures: pay one round trip, then a roll every ~30 days, plus ~neutral financing.
cost_fut = rt_pair_bps + roll_bps * (days / 30.0) + fut_fin_ann * 1e4 * days / 365.0

fig, ax = plt.subplots(figsize=(11, 4.8))
ax.plot(days, cost_intraday, color=C["red"],   lw=2.2, label="Cash intraday (re-cross daily)")
ax.plot(days, cost_slb,      color=C["green"], lw=2.2, label="SLB borrow (3%/yr fee)")
ax.plot(days, cost_fut,      color=C["blue"],  lw=2.2, label="Stock futures (monthly roll)")
ax.set_ylim(0, np.percentile(cost_intraday, 60))
ax.set_title("Cost of CARRYING a pair vs holding period (bps of leg notional)")
ax.set_xlabel("intended holding period (calendar days)"); ax.set_ylabel("cumulative round-trip cost (bps)")
ax.legend(loc="upper left")
plt.tight_layout(); plt.show()

x_cross = days[np.argmin(np.abs(cost_intraday - cost_fut))]
print(f"one pair round trip ~ {rt_pair_bps:,.0f} bps (4 fills: 2 legs x entry+exit)")
print(f"intraday re-crossing overtakes futures after ~{x_cross} day(s) of holding.")
print("Read: intraday is ONLY for sub-day pairs; for any multi-day hold, futures/SLB dominate.")
