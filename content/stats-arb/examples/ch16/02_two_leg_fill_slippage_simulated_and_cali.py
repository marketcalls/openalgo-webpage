# Two-leg fill slippage, simulated and CALIBRATED ON REAL 5m INTRADAY VOLATILITY.
# We measure how fast a liquid name moves intra-bar, then ask: if leg B fills g seconds
# after leg A, how much extra cost does that gap add beyond just crossing the spread?
cal = load("HDFCBANK", interval="5m", start="2026-04-01", end="2026-06-26", source="db")
r5 = np.log(cal["close"] / cal["close"].shift(1))
same = pd.Series(cal.index.date, index=cal.index)
r5 = r5[same.values == same.shift(1).values].dropna()          # drop overnight gaps
vol_per_sec = r5.std() / np.sqrt(300)                           # a 5-minute bar = 300 seconds
half_spread = 5.2 / 2 / 1e4                                     # ~5.2 bps full spread (measured below), as a fraction

rng = np.random.default_rng(7)
N = 40000
gap = rng.uniform(2, 90, N)                                     # seconds to fill the 2nd leg while chasing
z   = rng.standard_normal(N)
drift_sd     = vol_per_sec * np.sqrt(gap)                       # std of leg-B move over the gap
directional  = drift_sd * z                                    # signed move on leg B (mean 0, adds variance)
adverse_bias = 0.40 * drift_sd                                 # systematic: you tend to chase INTO the move
spread_only  = 2 * half_spread                                 # both legs cross half the spread - unavoidable
legging_cost = (spread_only + adverse_bias + np.abs(directional) * (directional > 0)) * 1e4  # bps, entry
# (we keep only the adverse half of the directional move; a favourable move just lowers cost toward spread-only)

fig, ax = plt.subplots(figsize=(11, 4.8))
sns.histplot(legging_cost, bins=70, color=C["amber"], stat="density", ax=ax)
ax.axvline(spread_only * 1e4, color=C["green"], lw=2, ls="--", label=f"spread-only floor = {spread_only*1e4:.1f} bps")
ax.axvline(np.median(legging_cost), color=C["blue"], lw=2, label=f"median = {np.median(legging_cost):.1f} bps")
ax.axvline(np.percentile(legging_cost, 95), color=C["red"], lw=2, label=f"95th pct = {np.percentile(legging_cost,95):.1f} bps")
ax.set_title("Legging slippage on ENTRY (one pair), calibrated on real HDFCBANK 5m vol")
ax.set_xlabel("entry cost (bps of notional)"); ax.set_ylabel("density"); ax.legend()
plt.tight_layout(); plt.show()

print(f"measured 5m return vol = {r5.std()*1e4:.1f} bps  ->  per-second vol = {vol_per_sec*1e4:.3f} bps")
print(f"spread-only floor  : {spread_only*1e4:5.1f} bps")
print(f"median legged entry: {np.median(legging_cost):5.1f} bps")
print(f"95th-pct legged    : {np.percentile(legging_cost,95):5.1f} bps  (a bad-gap fill)")
print(f"share of entries costing > 2x the spread floor: {(legging_cost > 2*spread_only*1e4).mean():.0%}")
print("And this is ENTRY only - the exit legs the same way, doubling the legging drag over a round trip.")
